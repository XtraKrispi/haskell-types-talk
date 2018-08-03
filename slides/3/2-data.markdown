# The Type System

Creating types with `data`
--------------------------

* `data Foo = Foo Int` behaves almost exactly like `newtype` but the compiler 
  does not strip away the wrapper
  * `data Foo` introduces a *type constructor*
  * `Foo Int` introduces a *data constructor*
  * The two constructors do not need to be the same
    * `data Foo = Bar Int` is perfectly valid
* `data` supports *records*
  ```haskell
  data MyType = MyType { fieldA :: Int
                       , fieldB :: String 
                       }
  ```
  * *caveat*: records produce **functions** with the same names as the record fields
  
    ```haskell
    x = MyType { fieldA = 1, fieldB = "Test" }
    y = fieldA x -- 1
    ```
    This means that names can conflict, so watch the naming