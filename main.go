package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/AUPubToiletServer/helper"
	"github.com/AUPubToiletServer/models"
	"github.com/rs/cors"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func homeLink(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, `<p> Public Toilet (AU) REST API -  <br> 
					GET: /api/toilets <br> 				
					GET: /api/toilet/<ID>, <br>
					POST: /api/toilets with body {lat: <>,  long: <>} 
					POST: /api/toilets-dist with body {lat: <>,  long: <>,  distance: <int>} 
					</p>`)
}

// GetToiletByID - Gets a toilet by ID - GET Request
func GetToiletByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	toiletID := mux.Vars(r)["id"]
	fmt.Println("Got request for toilet with ID: ", toiletID)

	var results []models.Point

	objectID, err := primitive.ObjectIDFromHex(toiletID)
	if err != nil {
		log.Println("Invalid id")
	}

	filter := bson.M{"_id": objectID}

	cur, err := toiletCollection.Find(context.TODO(), filter)

	if err != nil {
		helper.GetError(err, w)
		return
	}

	defer cur.Close(context.TODO())

	for cur.Next(context.TODO()) {
		var elem models.Point
		err := cur.Decode(&elem)
		if err != nil {
			fmt.Println("Could not decode Point")
			if err != nil {
				log.Fatal(err)
			}
		}

		results = append(results, elem)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	json.NewEncoder(w).Encode(results)
}

// GetOneToilet - Retrieves ONE toilet - GET request
func GetOneToilet(w http.ResponseWriter, r *http.Request) {
	// create a value into which the result can be decoded
	var result models.Point

	filter := bson.D{}

	err := toiletCollection.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		log.Fatal(err)
	}

	//convert it to JSON so it can be displayed
	formatter := json.MarshalIndent
	response, _ := formatter(result, " ", "   ")

	fmt.Println(string(response))
	json.NewEncoder(w).Encode(result)
}

// GetPointsByDistance - helper for GetToiletByLatLong
func GetPointsByDistance(ctx context.Context, toiletCollection *mongo.Collection, location models.Location, distance int) ([]models.Point, error) {
	var results []models.Point

	filter := bson.D{
		{"loc",
			bson.D{
				{"$near", bson.D{
					{"$geometry", location},
					{"$maxDistance", distance},
				}},
			}},
	}

	options := options.Find()

	// Limit by 3 documents only
	options.SetLimit(3)

	cur, err := toiletCollection.Find(ctx, filter, options)

	if err != nil {
		return []models.Point{}, err
	}

	defer cur.Close(context.TODO())

	for cur.Next(ctx) {
		var elem models.Point
		err := cur.Decode(&elem)
		if err != nil {
			fmt.Println("Could not decode Point")
			return []models.Point{}, err
		}

		results = append(results, elem)
	}

	return results, nil
}

// GetToiletByLatLong - Gets a toilet by Lat,Long in body - POST request
func GetToiletByLatLong(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// var coordinates []string
	reqBody, _ := ioutil.ReadAll(r.Body)

	var inputLocation models.InputLocation

	if err := json.Unmarshal(reqBody, &inputLocation); err != nil {
		log.Fatal(err)
	}

	points, _ := GetPointsByDistance(context.TODO(), toiletCollection, helper.NewLocation(inputLocation.Long, inputLocation.Lat), 500)

	//convert it to JSON so it can be displayed
	formatter := json.MarshalIndent
	response, _ := formatter(points, " ", "   ")

	fmt.Println(string(response))
	json.NewEncoder(w).Encode(models.ToiletsResponse{
		"success",
		"Toilets retrieved successfully",
		points,
	})
}

// GetToiletByLatLongDist - Gets a toilet by Lat,Long,Dist in body - POST request
func GetToiletByLatLongDist(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// var coordinates []string
	reqBody, _ := ioutil.ReadAll(r.Body)

	var inputLocationWithDistance models.InputLocationDist

	if err := json.Unmarshal(reqBody, &inputLocationWithDistance); err != nil {
		log.Fatal(err)
	}

	points, _ := GetPointsByDistance(context.TODO(), toiletCollection, helper.NewLocation(inputLocationWithDistance.Long, inputLocationWithDistance.Lat), inputLocationWithDistance.Distance)

	//convert it to JSON so it can be displayed
	formatter := json.MarshalIndent
	response, _ := formatter(points, " ", "   ")

	fmt.Println(string(response))
	json.NewEncoder(w).Encode(models.ToiletsResponse{
		"success",
		"Toilets retrieved successfully",
		points,
	})
}

//Connection mongoDB with helper class
var toiletCollection = helper.ConnectDB()

func main() {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", homeLink).Methods("GET")
	router.HandleFunc("/api/toilet/{id}", GetToiletByID).Methods("GET")
	router.HandleFunc("/api/toilets/", GetToiletByLatLong).Methods("POST")
	router.HandleFunc("/api/toilets-dist/", GetToiletByLatLongDist).Methods("POST")
	router.HandleFunc("/api/toilet/", GetOneToilet).Methods("GET")

	// Use this to test locally without CORS / HTTPS
	// fmt.Println(http.ListenAndServe(fmt.Sprintf(":%d", 8080), router))

	handler := cors.Default().Handler(router)

	//  Start HTTP
	go func() {
		errHTTP := http.ListenAndServe(fmt.Sprintf(":%d", 8080), router)
		if errHTTP != nil {
			log.Fatal("Web server (HTTP): ", errHTTP)
		}
	}()

	//  Start HTTPS
	errHTTPS := http.ListenAndServeTLS(fmt.Sprintf(":%d", 8443),
		"/etc/letsencrypt/live/jacintomendes.com/cert.pem",
		"/etc/letsencrypt/live/jacintomendes.com/privkey.pem",
		handler)
	if errHTTPS != nil {
		log.Fatal("Web server (HTTPS): ", errHTTPS)
	}

}
