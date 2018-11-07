## Miscellaneous Function Stuff (cont.)

Functions in Haskell are expressions, meaning they can only have one statement

There are helpers for making this easier to work with:

``` language-haskell

  angrify = helper "test"
    where helper str = str ++ "!"

  -- or 

  angrify = let helper str = str ++ "!"
            in helper "test"

```

Separate clauses can chain:

``` language-haskell
  angrify = let toAppend = '!'
                reallyAngry = replicate 5 toAppend
                helper str = str ++ reallyAngry
            in  helper "test"
```