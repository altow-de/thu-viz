import gsw as gsw
import json
import sys


def calculate_salinity(measurements):
    salinity_psu = []
    for measurement in measurements:
        conductivity, temperature, pressure = measurement
        pressure_gsw = (float(pressure) - 1013) / 100
        sp = gsw.conversions.SP_from_C(float(conductivity),float(temperature), pressure_gsw)
        salinity_psu.append(sp)
    return salinity_psu

if __name__ == "__main__":
    # Lesen der Eingabedaten von stdin
    input_data = json.load(sys.stdin)
    measurements = input_data["measurements"]
    salinity_results = calculate_salinity(measurements)
    
    # Ausgabe der Ergebnisse als JSON
    print(json.dumps(salinity_results))

