### General Info

I forked your pspdfkit/react-native repo and applied our customizations via:
  - git diff --no-color --binary commit_hash_tagged_version_commit commit_hash_with_customization > tmp/X.Y.Z-custom.patch
  - git apply --whitespace=fix tmp/X.Y.Z-custom.patch

The setup is only completed for iOS!

### How to reproduce
#### desired behavior
1. checkout `custom/version-2.8.1` from git submodule `mbeutner/react-native-pspdfkit`
1. install and open the app
1. look at the marker size
1. change submodule branch to `custom/version-2.11.0`
1. install the app on different device/simulator
1. A/B comparison - the marker size should differ