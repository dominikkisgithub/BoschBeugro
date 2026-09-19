<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class EnergyPriceController extends Controller
{
    public function getPrices()
    {
        $response = Http::get("https://api.energy-charts.info/v2/price?bzn=HU");

        if ($response->failed())
        {
            return response()->json(["Nem sikerült lekérni az árakat."]);
        }

        $data = $response->json();

        $prices = [];
        
        foreach ($data["data"] as $item)
        {
            $currTime = $item["timestamp"];
            $eurMWh = $item["values"]["day_ahead_price"];

            $hufKWh = round(($eurMWh / 1000) * 380, 2);

            $prices[] = [
                "time" => $currTime,
                "priceHufKWh" => $hufKWh
            ];
        }

        return response()->json($prices);
    }
}
