<?php

namespace App\Services;

class CnpjValidator
{
    /**
     * Validate a CNPJ number.
     *
     * @param string $cnpj
     * @return bool
     */
    public static function validate(string $cnpj): bool
    {
        // Remove any non-digit characters
        $cnpj = preg_replace('/[^0-9]/', '', $cnpj);

        // Check if CNPJ has 14 digits
        if (strlen($cnpj) != 14) {
            return false;
        }

        // Check for repeated digits (invalid CNPJ)
        if (preg_match('/^(\d)\1+$/', $cnpj)) {
            return false;
        }

        // Validate first digit
        $sum = 0;
        for ($i = 0, $j = 5; $i < 12; $i++) {
            $sum += $cnpj[$i] * $j;
            $j = ($j == 2) ? 9 : $j - 1;
        }
        $remainder = $sum % 11;
        $digit1 = ($remainder < 2) ? 0 : 11 - $remainder;

        if ($cnpj[12] != $digit1) {
            return false;
        }

        // Validate second digit
        $sum = 0;
        for ($i = 0, $j = 6; $i < 13; $i++) {
            $sum += $cnpj[$i] * $j;
            $j = ($j == 2) ? 9 : $j - 1;
        }
        $remainder = $sum % 11;
        $digit2 = ($remainder < 2) ? 0 : 11 - $remainder;

        return $cnpj[13] == $digit2;
    }
}