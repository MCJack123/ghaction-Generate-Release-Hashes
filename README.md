# Generate Release Hashes - GitHub Action
A GitHub action to automatically generate a list of hashes for a release.

## Inputs
### `hash-type`
The type of hash to generate for each file. Must be one of `md5`, `sha1`, `sha256`, or `sha512`. Defaults to `sha256`.

## Outputs
### `hashes`
A string with the list of files/hashes generated by the action.

## Example usage
Upload the list as an artifact:  
```yml
- uses: MCJack123/ghaction-generate-release-hashes@v1
  with:
    hash-type: sha1
    file-name: hashes.txt
- uses: actions/upload-artifact@v2
  with:
    name: Asset Hashes
    path: hashes.txt
```