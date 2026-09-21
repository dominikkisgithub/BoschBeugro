<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $expectedToken = "KIS-DOMINIK-BOSCH-BEUGRO";

        $token = $request -> bearerToken();

        if ($token !== $expectedToken)
        {
            return response() -> json(["error" => "Hibás token!"], 401);
        }

        return $next($request);
    }
}
