---
layout: post
title: "Python Module Versioning and Releases"
date: 2020-06-15
categories: Python Package
annotation: Python
---

At work, these days, I am building some new Python ML modules to be used within other projects. When I am making modules for myself, I don't care about the versioning or releases. But working in an environment when others are using your libraries then versioning is required. This is what I know now which I wish I had known before starting.

## Developing the module

How to test your module features before even committing them to the git.

### Simple py script

Create a `py` script in the root directory of your library and then test all the functionalities of the module. Or in every module file use the `if __name__ == "__main__"` block to test that file individually. This is the most basic thing that one does.

Now, let's say you want to test this module inside another code base. With this method, your only choice is to move this module directory inside that other project and then import it. But there's a better way.

### Using `sys.path.insert`

The method is to insert the following code at the top of your file in other code base.

```
import sys
sys.path.insert(0,'/path/to/mod_directory')
```

Here you have added the path to the directory where you module resides in the system path where python searches whenever you import something. This way you can directly import the module to check if it works properly inside that code base and make changes accordingly to the module. Remember though, this should not be the way you import code inside the actual code base. This method is just used to test the module inside other project. There are other [similar](https://stackoverflow.com/q/1893598/2650427) methods.

But there's a more efficient method.

### Development Mode

- Reading: [Working in "development mode"](https://packaging.python.org/guides/distributing-packages-using-setuptools/#working-in-development-mode)
- Reading: [`distutils` Develop](https://setuptools.readthedocs.io/en/latest/setuptools.html#development-mode)

**TL;DR**

- `pip install -e .`
- In the above command`-e` is for `--editable` and `.` is the present directory (run the command from your module directory).
- The command a link to the current directory in python packages so that it's available on `sys.path`
- `pip uninstall -e .`

or

- `setup.py develop`
- Installs module in the development mode which means it can us updated and reinstalled without doing in uninstall.
- `setup.py develop --uninstall`

## Module Versioning

Next is, how do you version your module? There are many versioning techniques. Which ones are accepted by pip? When should we bump the version numbers?

- Reading: [Preferred way - Semantic Versioning](https://packaging.python.org/guides/distributing-packages-using-setuptools/#semantic-versioning-preferred)
- Reading: [Semantic Versioning](https://semver.org/)

**TL;DR**

- 3-part `MAJOR.MINOR.MAINTENANCE` numbering scheme
    - `MAJOR` version when they make incompatible API changes,
    - `MINOR` version when they add functionality in a backwards-compatible manner, and
    - `MAINTENANCE` version when they make backwards-compatible bug fixes.
- Major version zero (`0.y.z`) is for initial development. Anything MAY change at any time. The public API SHOULD NOT be considered stable.
- Version `1.0.0` defines the public API. The way in which the version number is incremented after this release is dependent on this public API and how it changes.
- Patch version `Z` (`x.y.Z | x > 0`) MUST be incremented if only backwards compatible bug fixes are introduced. A bug fix is defined as an internal change that fixes incorrect behavior.
- Minor version `Y` (`x.Y.z | x > 0`) MUST be incremented if new, backwards compatible functionality is introduced to the public API. It MUST be incremented if any public API functionality is marked as deprecated. It MAY be incremented if substantial new functionality or improvements are introduced within the private code. It MAY include patch level changes. Patch version MUST be reset to 0 when minor version is incremented.
- Major version `X` (`X.y.z | X > 0`) MUST be incremented if any backwards incompatible changes are introduced to the public API. It MAY also include minor and patch level changes. Patch and minor version MUST be reset to 0 when major version is incremented.


## Git Release Tagging

Git tagging is an effective way to bookmark different stages of your code base. Reached a version, git tag it with all the meta information to keep a history about the release. You cannot change the history which is part of a git tag - meaning, you freeze your code base till the commit you tagged.

- Reading: [Git tag](https://www.atlassian.com/git/tutorials/inspecting-a-repository/git-tag)

Gist:

- Tagging
    - Essentially bookmarking in the code base.
- Two tag types:
    - **annotated**: stores extra metadata in git database.
    - **lightweight**: stores only the hash of the commit it refers to.
- Create Annotated Tags
    - `git tag -a v1.0.0 <commit_hash>`
    - `git tag -a v1.0.0` (uses current commit)
    - `git tag -a v1.0.0 -m "Releasing version v1.0.0"`
- Creating Lightweight Tags
    - `git tag v1.0.0` (uses current commit)
    - `git tag v1.0.0 <commit_hash>`
- Listing Tags
    - `git tag`
    - `git tag -n3` (shows tag messages as well)
    - `git show <tag_identifier>` (specifig tag details)
- Update previous tag
    - `git tag -a -f v1.0.0 <commit_hash>`
- Viewing state of repo at given tag
    - `git checkout v1.0.0`
- Deleting tag
    - `git tag -d v1.0.0`
- Publishing tags to github/gitlab
    - `git push <location> <tag_identifier>` (e.g., `git push origin v1.0.0`)
    - `git push <tag_identifier>`
    - `git push --tags`
