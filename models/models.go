package models

// Location - MongoDB geospatial structure
type Location struct {
	GeoJSONType string    `json:"type" bson:"type"`
	Coordinates []float64 `json:"coordinates" bson:"coordinates"`
}

// Point - structure of document in the toilets collection
type Point struct {
	ID               string   `json:"id" bson:"_id"`
	Address          string   `json:"address" bson:"address"`
	Name             string   `json:"name" bson:"name"`
	Town             string   `json:"town" bson:"town"`
	State            string   `json:"state" bson:"state"`
	Postcode         string   `json:"postcode" bson:"postcode"`
	Male             string   `json:"male" bson:"male"`
	Female           string   `json:"female" bson:"female"`
	Unisex           string   `json:"unisex" bson:"unisex"`
	AccessibleMale   string   `json:"accessible_male" bson:"accessible_male"`
	AccessibleFemale string   `json:"accessible_female" bson:"accessible_female"`
	Ambulant         string   `json:"ambulant" bson:"ambulant"`
	BabyChange       string   `json:"baby_change" bson:"baby_change"`
	SharpsDisposal   string   `json:"sharps_disposal" bson:"sharps_disposal"`
	SanitaryDisposal string   `json:"sanitary_disposal" bson:"sanitary_disposal"`
	Loc              Location `json:"loc" bson:"loc"`
}

// InputLocation - input location from user
type InputLocation struct {
	Lat  float64 `json:"lat"`
	Long float64 `json:"long"`
}

// ToiletsResponse - response for GetToiletByLatLong
type ToiletsResponse struct {
	Status  string  `json:"status"`
	Message string  `json:"message"`
	Data    []Point `json:"data"`
}
