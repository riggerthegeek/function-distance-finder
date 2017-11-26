# Function Distance Finder

[OpenFAAS](https://openfaas.com) function for finding distance between two points

## Input

The input format is YAML (including JSON).

- **start**: `String` The start point. Typically this should be a postcode (required)
- **dest**: `String` The destination. Typically this should be a postcode (required)
- **return**: `Boolean` Whether this is a return journey. Defaults to `false`
- **mode**: `String` How you are travelling. Allowable are 'driving', 'walking', 'bicycling'. Defaults to `driving`
- **avoid**: `String` Things to avoid. Allowable are `null`, 'highways', 'tolls'. Defaults to `null`

## Output

Returns a number. This is the distance in metres.
