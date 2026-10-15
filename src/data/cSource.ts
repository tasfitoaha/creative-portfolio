export const C_SOURCE_CODE = `/*
 * pythagorean_finder.c
 *
 * Pythagorean Relation Finder
 * Searches for integer relationships between perfect squares up to a
 * given maximum n:
 *   - Three-square relations:  a^2 + b^2 = c^2
 *   - Four-square relations:  a^2 + b^2 + c^2 = d^2
 *
 * Variables are kept in non-decreasing order so each relation is
 * listed only once.  Perfect-square tests use exact integer
 * arithmetic (no floating-point equality).
 *
 * Compile:  gcc -O2 -o pythagorean_finder pythagorean_finder.c -lm
 * Usage:    ./pythagorean_finder <n>
 *
 * Author: Haniw Mejelin
 */

#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <stdbool.h>

/* ------------------------------------------------------------------ */
/*  Exact perfect-square test using integer arithmetic                 */
/* ------------------------------------------------------------------ */
static bool is_perfect_square(long long x)
{
    if (x < 0)
        return false;

    long long s = (long long)floor(sqrt((double)x));
    /* Adjust for potential rounding error in sqrt */
    while (s * s > x)
        s--;
    while ((s + 1) * (s + 1) <= x)
        s++;

    return s * s == x;
}

/* ------------------------------------------------------------------ */
/*  Search for three-square relations:  a^2 + b^2 = c^2               */
/*  Constraints: 1 <= a <= b <= c <= n                                 */
/* ------------------------------------------------------------------ */
static long long search_three_squares(long long n)
{
    long long count = 0;

    for (long long c = 1; c <= n; c++) {
        long long c_sq = c * c;

        for (long long b = 1; b <= c; b++) {
            long long b_sq = b * b;
            long long a_sq = c_sq - b_sq;

            if (a_sq < 1)
                break;  /* b too large, no more solutions for this c */

            long long a = (long long)floor(sqrt((double)a_sq));
            /* Adjust for rounding */
            while (a * a > a_sq)
                a--;
            while ((a + 1) * (a + 1) <= a_sq)
                a++;

            if (a * a == a_sq && a >= 1 && a <= b) {
                printf("  3-square:  %lld^2 + %lld^2 = %lld^2\\n",
                       a, b, c);
                count++;
            }
        }
    }

    return count;
}

/* ------------------------------------------------------------------ */
/*  Search for four-square relations:  a^2 + b^2 + c^2 = d^2          */
/*  Constraints: 1 <= a <= b <= c <= d <= n                            */
/* ------------------------------------------------------------------ */
static long long search_four_squares(long long n)
{
    long long count = 0;

    for (long long d = 1; d <= n; d++) {
        long long d_sq = d * d;

        for (long long c = 1; c <= d; c++) {
            long long c_sq = c * c;
            long long rem1 = d_sq - c_sq;

            if (rem1 < 2)
                break;  /* c too large */

            for (long long b = 1; b <= c; b++) {
                long long b_sq = b * b;
                long long a_sq = rem1 - b_sq;

                if (a_sq < 1)
                    break;  /* b too large for this c */

                long long a = (long long)floor(sqrt((double)a_sq));
                /* Adjust for rounding */
                while (a * a > a_sq)
                    a--;
                while ((a + 1) * (a + 1) <= a_sq)
                    a++;

                if (a * a == a_sq && a >= 1 && a <= b) {
                    printf("  4-square:  %lld^2 + %lld^2 + %lld^2 = %lld^2\\n",
                           a, b, c, d);
                    count++;
                }
            }
        }
    }

    return count;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */
int main(int argc, char *argv[])
{
    if (argc != 2) {
        fprintf(stderr, "Usage: %s <n>\\n", argv[0]);
        return 1;
    }

    /* Parse n as a long long */
    char *endptr;
    long long n = strtoll(argv[1], &endptr, 10);

    if (*endptr != '\\0' || n < 1) {
        fprintf(stderr, "Error: n must be a positive integer.\\n");
        return 1;
    }

    printf("\\n=== Pythagorean Relation Finder ===\\n");
    printf("Searching up to n = %lld\\n\\n", n);

    printf("--- Three-square relations (a^2 + b^2 = c^2) ---\\n");
    long long three_count = search_three_squares(n);
    printf("\\n  Total three-square relations: %lld\\n\\n", three_count);

    printf("--- Four-square relations (a^2 + b^2 + c^2 = d^2) ---\\n");
    long long four_count = search_four_squares(n);
    printf("\\n  Total four-square relations: %lld\\n\\n", four_count);

    printf("Search complete.\\n");
    return 0;
}
`;
