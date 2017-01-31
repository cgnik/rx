package main

import (
	"net/http"
	"math"
)

func main() {
	mux := http.NewServeMux();
	mux.Handle("/", http.FileServer(http.Dir("static/")))
	mux.HandleFunc("/service", handleRest)
	srv := http.Server{Addr: "localhost:8080", Handler: mux}
	srv.ListenAndServe();
}

func handleRest(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":

		break;
	}
}

func calcStdDev(points []float64) float64 {
	var mean = calcMean(points);
	devsquares := points[0:]
	for index, devsquare := range (devsquares) {
		devsquares[index] = math.Pow((devsquare - mean), 2);
	}
	deviatedmean := calcMean(devsquares);
	stddev := math.Sqrt(deviatedmean);
	return round(stddev, 0.5, 1); // stupid human rounding trick
}

func calcMean(points []float64) float64 {
	var sum float64 = 0.0
	for _, point := range (points) {
		sum += point
	}
	return sum / float64(len(points));
}

// from https://play.golang.org/p/KNhgeuU5sT
func round(val float64, roundOn float64, places int) float64 {
	pow := math.Pow(10, float64(places))
	digit := pow * val
	_, div := math.Modf(digit)
	var round float64
	if val > 0 {
		if div >= roundOn {
			round = math.Ceil(digit)
		} else {
			round = math.Floor(digit)
		}
	} else {
		if div >= roundOn {
			round = math.Floor(digit)
		} else {
			round = math.Ceil(digit)
		}
	}
	return round / pow
}
