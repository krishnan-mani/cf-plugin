
# Author templates for AWS CloudFormation

This extension help you author AWS CloudFormation templates with ease.

It uses JSON schema validation features of VSCode to validate your template files against a schema for AWS CloudFormation (currently uses [cloudformation-jsonschema](https://github.com/krishnan-mani/cloudformation-jsonschema))

## Capabilities

- Supports authoring of CloudFormation templates in JSON
- Highlights errors with a helpful error message (in the "Problems" pane, and as a pop-up message visible on hover)
  - Highlights errors when JSON is malformed
  - Highlights errors for required elements, required properties, invalid document structure, etc.
- Suggests top-level elements (such as ```Parameters```, ```Resources```, etc.)
- Auto-completes known elements (such as ```AWSTemplateFormatVersion```)
- Auto-completes structure of elements, intrinsic functions, etc.
- Suggests supported properties for elements in ```Parameters```, ```Resources```, ```Outputs```, etc.
- Suggests supported ```Type``` information for ```Parameters``` and ```Resources```
- Suggests required and supported properties for each resource (by ```Type```)
- Suggests intrinsic function names and 'shape'
- Currently relies upon a JSON schema for CloudFormation as published at [cloudformation-jsonschema](https://github.com/krishnan-mani/cloudformation-jsonschema)

## Coming soon ... 

See [TODO](TODO.md) and [requirements](requirements/features.md)

## Illustration

1. Suggest top-level elements

![Top-level elements](images/top-level-elements-prompts.png)

2. Validate that JSON is well-formed

![well-formed JSON](images/json-well-formedness-validation.png)

3. Suggest properties for ```Parameters``` elements

![properties for ```Parameters``` elements](images/parameter-property-prompts.png)

4. Validate required ```Type``` for ```Parameters``` elements

![required ```Type``` for ```Parameters```](images/missing-parameter-type.png)

5. Suggest ```Type``` for ```Parameters``` elements

![supported values of ```Type``` for ```Parameters``` element](images/parameter-type-auto-completion.png)

6. Validate ```Type``` value for ```Parameters```

![invalid ```Type``` for ```Parameters``` element](images/parameter-type-validation.png)

7. Suggest properties for ```Resources``` elements

![properties for ```Resources``` element](images/resource-property-prompts.png)

8. Suggest ```Type``` for ```Resources``` elements

![supported values of ```Type``` for ```Resources``` element](images/resource-type-prompts.png)

9. Validate required properties for a given resource (by ```Type```)

![validate properties for a given ```Type``` of ```Resources``` element](images/resource-type-required-properties-validation.png)

10. Suggest properties for a given resource (by ```Type```)

![properties for a given ```Type``` of ```Resources``` element](images/resource-type-property-prompts.png)

11. Suggest intrinsic function names

![intrinsic functions](images/function-names-prompt.png)

12. Suggest intrinsic function 'shape'

![shape of intrinsic function](images/intrinsic-function-shape.png)

## Requirements

This extension is active when working with templates with a filename ending in `.cf.json`

## Source

The source for this extension is maintained at Github repository [cf-plugin](git@github.com:krishnan-mani/cf-plugin.git)
