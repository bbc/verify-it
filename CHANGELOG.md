# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.4.0] - 2026-02-27

### Added

- This CHANGELOG!
- Support for the native `node:test` library
- An `init` function to avoid the need for global `it`, `test`, and `describe` functions

### Changed

- Deprecated global `verify` object in favour of explicit initialisation using `init`
- Errors due to missing global `it` and `test` functions are only thrown when the global `verify` object is used (previously an error would be thrown immediately when this library was imported)

[Unreleased]: https://github.com/bbc/verify-it/compare/v2.4.0...HEAD
[2.4.0]: https://github.com/bbc/verify-it/compare/v2.4.0...v2.3.3
