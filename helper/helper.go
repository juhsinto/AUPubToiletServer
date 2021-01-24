package helper

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/AUPubToiletServer/models"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// ConnectDB : This is helper function to connect mongoDB
// If you want to export your function. You must to start upper case function name. Otherwise you won't see your function when you import that on other class.
func ConnectDB() *mongo.Collection {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	MONGO_DB_PW := os.Getenv("MONGO_DB_PW")

	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb+srv://jacinto:" + MONGO_DB_PW + "@toilets-au.kbefj.mongodb.net/toilets_au?retryWrites=true&w=majority"))
	if err != nil {
		log.Fatal(err)
	}
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	// defer client.Disconnect(ctx)

	quickstartDatabase := client.Database("toilets_au")
	toiletCollection := quickstartDatabase.Collection("toilets")

	return toiletCollection
}

// ErrorResponse : This is error model.
type ErrorResponse struct {
	StatusCode   int    `json:"status"`
	ErrorMessage string `json:"message"`
}

// GetError : This is helper function to prepare error model.
// If you want to export your function. You must to start upper case function name. Otherwise you won't see your function when you import that on other class.
func GetError(err error, w http.ResponseWriter) {

	log.Fatal("error from GetError: ", err.Error())
	// TODO - emailing or notification that error occurred
	var response = ErrorResponse{
		ErrorMessage: err.Error(),
		StatusCode:   http.StatusInternalServerError,
	}

	message, _ := json.Marshal(response)

	w.WriteHeader(response.StatusCode)
	w.Write(message)
}

// NewLocation - creates a Location obj
func NewLocation(lat, long float64) models.Location {
	return models.Location{
		"Point",
		[]float64{lat, long},
	}
}
