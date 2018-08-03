# The Type System

User Defined Types
-------------------

* Three ways to define types (note, these are **not** classes):

  ```
  type MyType = Int
  newtype MyOtherType = MyOtherType Int
  data YetAnother = YetAnother Int
  ```
* The `type` keyword defines an alias for a type
  * Can be used interchangeably
  * `Int` equals `MyType`
* `newtype` defines a single type alias, with compiler enforcement
  * `Int` does **not** equal `MyOtherType`
  * Compiler removes the wrapping of the type so there is no overhead
* `data` is the most interesting way to create types...