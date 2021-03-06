# Change Log
All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/) and the general rules of thumb at http://keepachangelog.com/.

## [1.0.0-beta.1] - 2016-04-13
### Added
- Apps can now declare a WCAG URL for linking out to a web page that describes a particular app's WCAG conformance.
- Apps can now declare a list of supported features.
- Apps can now declare different types of supported licensing arrangements.
- Apps can now declare their support for different facets of application security.
- Apps can now declare how they intend to utilize student data.

### Changed
- The LTI Attribute now allows a list of LTI Configurations to be setup for an app.

## [1.0.0-beta] - 2015-08-31
### Added
- Apps can now declare their support for Caliper Metric Profiles via the Caliper attribute within the Interoperability attribute group.
- Apps can now declare WCAG guideline adherence via the WCAG attribute within the Accessibility attribute group.
- Apps can now include admin and support contact information as well as an application icon within the Foundational attribute group.
- Apps can now declare their support for non-normative educational competencies via the Competencies attribute within the Education attribute group.

### Changed
- For Local and Publisher modules, dropped static URI paths for HTTP GET in favor of a recommendation to use a canonical URI path.
- Support for LTI using the LTI attribute has been completely reworked.

## Pre-Beta
- Release of the basic protocol including the main modules (Payload, Publisher, Receiver, Relay and Local) as well as
the initial set of attribute groups (Foundational, Client Features, Interoperability, Privacy and Accessibility).
