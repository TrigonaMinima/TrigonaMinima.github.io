---
layout: post
title: "Error Function and CDF"
date: "2024-01-19"
categories: ML
---


The Python ecosystem makes life easy for you. You quickly implement an algorithm using available libraries and test it. At deployment, just ensure correct libraries, and you are good to go. But, what if it is a non-Python environment?

Recently, I had to calculate the [CDF](todo) of a normal distribution in a primitive javascript environment. I was not allowed to install any javascript library. I worked through it's implementation from scratch. This post is the documentation of that process.


## Error Function - $\text{erf}(x)$

The error function is defined as:

$$
\text{erf}(x) = \frac{2}{\sqrt{\pi}} \int_0^x e^{-t^2} dt
$$

Here are some properties of the error function that we will make use of later:

1. **Symmetry**: $\text{erf}(-x) = -\text{erf}(x)$. So, for negative inputs, the error function will have negative values. It follows from the following rule:

    $$
    \int_{a }^{b } f \left( x \right)  \,dx =-\int_{b }^{a } f \left( x \right)  \,dx
    $$

    More details here:  https://math.stackexchange.com/q/4206534/467063

2. **Complement Relationship**: The complement of the error function, often denoted as $\text{erfc}(x)$, is defined as $1 - \text{erf}(x)$.


Now we will look at different approximations of computing this integral.

## $\operatorname {erf}$ in `math`

Here is how we do it using the [math](todo) module.

```py
import math
math.erf(0.1)
# 0.1124629160182849
```

Let's look at erf value for different inputs.

```
  x      erf(x)
----- -----------
-3.00 -0.99997791
-2.00 -0.99532227
-1.00 -0.84270079
-0.50 -0.52049988
-0.25 -0.27632639
 0.00  0.00000000
 0.25  0.27632639
 0.50  0.52049988
 1.00  0.84270079
 2.00  0.99532227
 3.00  0.99997791
```

<details close>
<summary>click to reveal the code to generate the above results.</summary>
{% highlight python linenos %}
import math

print('{:^5}    {:7}'.format('x', 'erf(x)'))
print('{:-^5} {:-^11}'.format('', ''))
for x in [-3, -2, -1, -0.5, -0.25, 0, 0.25, 0.5, 1, 2, 3]:
    print('{:5.2f} {:11.8f}'.format(x, math.erf(x)))
{% endhighlight %}
</details>

<br>

The [Python source](todo) has extensive comments explaining the implementation.

> Method: we use a series approximation for `erf` for small `x`, and a continued fraction approximation for `erfc(x)` for larger `x`; combined with the relations `erf(-x) = -erf(x)` and `erfc(x) = 1.0 - erf(x)`, this gives us `erf(x)` and `erfc(x)` for all `x`.
>
> The series expansion used is:

    erf(x) = x*exp(-x*x)/sqrt(pi) * [
                    2/1 + 4/3 x**2 + 8/15 x**4 + 16/105 x**6 + ...]

The coefficient of x**(2k-2) here is 4**k*factorial(k)/factorial(2*k).
This series converges well for smallish x, but slowly for larger x.

The continued fraction expansion used is:

    erfc(x) = x*exp(-x*x)/sqrt(pi) * [1/(0.5 + x**2 -) 0.5/(2.5 + x**2 - )
                            3.0/(4.5 + x**2 - ) 7.5/(6.5 + x**2 - ) ...]

after the first term, the general term has the form:

    k*(k-0.5)/(2*k+0.5 + x**2 - ...).

This expansion converges fast for larger x, but convergence becomes
infinitely slow as x approaches 0.0.  The (somewhat naive) continued
fraction evaluation algorithm used below also risks overflow for large x;
but for large x, erfc(x) == 0.0 to within machine precision.  (For
example, erfc(30.0) is approximately 2.56e-393).

Parameters: use series expansion for abs(x) < ERF_SERIES_CUTOFF and
continued fraction expansion for ERF_SERIES_CUTOFF <= abs(x) <
ERFC_CONTFRAC_CUTOFF.  ERFC_SERIES_TERMS and ERFC_CONTFRAC_TERMS are the
numbers of terms to use for the relevant expansions.


{% highlight python linenos %}

#define ERF_SERIES_CUTOFF 1.5
#define ERF_SERIES_TERMS 25
#define ERFC_CONTFRAC_CUTOFF 30.0
#define ERFC_CONTFRAC_TERMS 50

/*
   Error function, via power series.

   Given a finite float x, return an approximation to erf(x).
   Converges reasonably fast for small x.
*/

static double
m_erf_series(double x)
{
    double x2, acc, fk, result;
    int i, saved_errno;

    x2 = x * x;
    acc = 0.0;
    fk = (double)ERF_SERIES_TERMS + 0.5;
    for (i = 0; i < ERF_SERIES_TERMS; i++) {
        acc = 2.0 + x2 * acc / fk;
        fk -= 1.0;
    }
    /* Make sure the exp call doesn't affect errno;
       see m_erfc_contfrac for more. */
    saved_errno = errno;
    result = acc * x * exp(-x2) / sqrtpi;
    errno = saved_errno;
    return result;
}

/*
   Complementary error function, via continued fraction expansion.

   Given a positive float x, return an approximation to erfc(x).  Converges
   reasonably fast for x large (say, x > 2.0), and should be safe from
   overflow if x and nterms are not too large.  On an IEEE 754 machine, with x
   <= 30.0, we're safe up to nterms = 100.  For x >= 30.0, erfc(x) is smaller
   than the smallest representable nonzero float.  */

static double
m_erfc_contfrac(double x)
{
    double x2, a, da, p, p_last, q, q_last, b, result;
    int i, saved_errno;

    if (x >= ERFC_CONTFRAC_CUTOFF)
        return 0.0;

    x2 = x*x;
    a = 0.0;
    da = 0.5;
    p = 1.0; p_last = 0.0;
    q = da + x2; q_last = 1.0;
    for (i = 0; i < ERFC_CONTFRAC_TERMS; i++) {
        double temp;
        a += da;
        da += 2.0;
        b = da + x2;
        temp = p; p = b*p - a*p_last; p_last = temp;
        temp = q; q = b*q - a*q_last; q_last = temp;
    }
    /* Issue #8986: On some platforms, exp sets errno on underflow to zero;
       save the current errno value so that we can restore it later. */
    saved_errno = errno;
    result = p / q * x * exp(-x2) / sqrtpi;
    errno = saved_errno;
    return result;
}

#endif /* !defined(HAVE_ERF) || !defined(HAVE_ERFC) */

/* Error function erf(x), for general x */

static double
m_erf(double x)
{
#ifdef HAVE_ERF
    return erf(x);
#else
    double absx, cf;

    if (Py_IS_NAN(x))
        return x;
    absx = fabs(x);
    if (absx < ERF_SERIES_CUTOFF)
        return m_erf_series(x);
    else {
        cf = m_erfc_contfrac(absx);
        return x > 0.0 ? 1.0 - cf : cf - 1.0;
    }
#endif
}

/* Complementary error function erfc(x), for general x. */

static double
m_erfc(double x)
{
#ifdef HAVE_ERFC
    return erfc(x);
#else
    double absx, cf;

    if (Py_IS_NAN(x))
        return x;
    absx = fabs(x);
    if (absx < ERF_SERIES_CUTOFF)
        return 1.0 - m_erf_series(x);
    else {
        cf = m_erfc_contfrac(absx);
        return x > 0.0 ? cf : 2.0 - cf;
    }
#endif
}
{% endhighlight %}


## Erf in `scipy`

The second method is using [scipy](https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.erf.html).

```py
from scipy.special import erf
erf(0.1)
# 0.1124629160182849
```

```
  x      erf(x)
----- -----------
-3.00 -0.99997791
-2.00 -0.99532227
-1.00 -0.84270079
-0.50 -0.52049988
-0.25 -0.27632639
 0.00  0.00000000
 0.25  0.27632639
 0.50  0.52049988
 1.00  0.84270079
 2.00  0.99532227
 3.00  0.99997791
```

Results are exactly the same till 8th decimal place in the both the functions.

here is how it is implemented

The scipy's implementation of the erf breaks it down into multiple parts:

1. If input is negative then we use the property that erf(-x) = -erf(x). todo: why?
2. If x > 6 then return 1. todo: why?
3. if x < 2.4 then use series expansion
4. for all the other x, use continued fraction expansion


https://github.com/scipy/scipy/blob/0a7631f00e4d9f61b12fd478916be830d7a627a5/scipy/stats/biasedurn/wnchyppr.cpp#L243

{% highlight python linenos %}
double Erf (double x) {
   // Calculates the error function erf(x) as a series expansion or
   // continued fraction expansion.
   static const double rsqrtpi  = 0.564189583547756286948; // 1/sqrt(pi)
   static const double rsqrtpi2 = 1.12837916709551257390;  // 2/sqrt(pi)
   if (x < 0.) return -Erf(-x);
   if (x > 6.) return 1.;
   if (x < 2.4) {
      // use series expansion
      double term;                     // term in summation
      double j21;                      // 2j+1
      double sum = 0;                  // summation
      double xx2 = x*x*2.;             // 2x^2
      int j;
      term = x;  j21 = 1.;
      for (j=0; j<=50; j++) {          // summation loop
         sum += term;
         if (term <= 1.E-13) break;
         j21 += 2.;
         term *= xx2 / j21;
      }
      return exp(-x*x) * sum * rsqrtpi2;
   }
   else {
      // use continued fraction expansion
      double a, f;
      int n = int(2.25f*x*x - 23.4f*x + 60.84f); // predict expansion degree
      if (n < 1) n = 1;
      a = 0.5 * n;  f = x;
      for (; n > 0; n--) {             // continued fraction loop
         f = x + a / f;
         a -= 0.5;
      }
      return 1. - exp(-x*x) * rsqrtpi / f;
   }
}
{% endhighlight %}


## Approx. Implementation #1

stack overflow approximation - https://stackoverflow.com/q/59127098/2650427


answer: https://stackoverflow.com/a/457805/2650427

{% highlight python linenos %}
def erf(x):
    # save the sign of x
    sign = 1 if x >= 0 else -1
    x = abs(x)

    # constants
    a1 =  0.254829592
    a2 = -0.284496736
    a3 =  1.421413741
    a4 = -1.453152027
    a5 =  1.061405429
    p  =  0.3275911

    # A&S formula 7.1.26
    t = 1.0/(1.0 + p*x)
    y = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*math.exp(-x*x)
    return sign*y # erf(-x) = -erf(x)
{% endhighlight %}

```
  x     math.erf   approx erf
----- ----------- -----------
-3.00 -0.99997791 -0.99997789
-2.00 -0.99532227 -0.99532214
-1.00 -0.84270079 -0.84270069
-0.50 -0.52049988 -0.52050002
-0.25 -0.27632639 -0.27632626
 0.00  0.00000000  0.00000000
 0.25  0.27632639  0.27632626
 0.50  0.52049988  0.52050002
 1.00  0.84270079  0.84270069
 2.00  0.99532227  0.99532214
 3.00  0.99997791  0.99997789
```

The approx. value is different after the 6th decimal place.

## Approx. Implementation #2

https://stackoverflow.com/a/458069/2650427

{% highlight python linenos %}
# from: http://www.cs.princeton.edu/introcs/21function/ErrorFunction.java.html
# Implements the Gauss error function.
#   erf(z) = 2 / sqrt(pi) * integral(exp(-t*t), t = 0..z)
#
# fractional error in math formula less than 1.2 * 10 ^ -7.
# although subject to catastrophic cancellation when z in very close to 0
# from Chebyshev fitting formula for erf(z) from Numerical Recipes, 6.2
def erf(z):
    t = 1.0 / (1.0 + 0.5 * abs(z))
        # use Horner's method
        ans = 1 - t * math.exp( -z*z -  1.26551223 +
                            t * ( 1.00002368 +
                            t * ( 0.37409196 +
                            t * ( 0.09678418 +
                            t * (-0.18628806 +
                            t * ( 0.27886807 +
                            t * (-1.13520398 +
                            t * ( 1.48851587 +
                            t * (-0.82215223 +
                            t * ( 0.17087277))))))))))
        if z >= 0.0:
            return ans
        else:
            return -ans
{% endhighlight %}

```
  x     math.erf   approx erf
----- ----------- -----------
-3.00 -0.99997791 -0.99997791
-2.00 -0.99532227 -0.99532227
-1.00 -0.84270079 -0.84270079
-0.50 -0.52049988 -0.52049991
-0.25 -0.27632639 -0.27632639
 0.00  0.00000000 -0.00000003
 0.25  0.27632639  0.27632639
 0.50  0.52049988  0.52049991
 1.00  0.84270079  0.84270079
 2.00  0.99532227  0.99532227
 3.00  0.99997791  0.99997791
```

The values change only for cases when the input is close to zero. This method seems a bit unreliable.

## Cumulative Distribution Function (CDF)

Different CDFs are available for different distributions. We will stick to the normal distribution here.

The value of CDF at a given $$x$$ represents a probability.


Phi(z) = 1/2[1 + erf(z/sqrt(2))]


## Conclusion



