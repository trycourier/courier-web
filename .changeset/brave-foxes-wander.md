---
"@trycourier/courier-vue": patch
"@trycourier/courier-angular": patch
---

Republish with corrected packaging: publish the ng-packagr dist output via `publishConfig.directory` (angular) and keep test files out of the published package (vue). The 1.0.0 release predated these fixes.
