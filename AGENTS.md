# JSON Editor rules

These rules apply to all files under `apps/json-editor`.

1. Do not use the TypeScript `readonly` modifier.
2. Order class members as follows: public fields, private fields, lifecycle methods, public methods, and private methods. Treat getters and setters as methods with their declared visibility. When a constructor is needed, place it after private fields and before lifecycle methods. Preserve initialization dependencies; initialize public fields in the constructor when they depend on private fields declared below them.
3. Do not insert blank lines between fields in the same group. Keep inputs, outputs, other public fields, and private fields as separate groups, with one blank line between groups. Keep each input or output decorator on the same line as its field.
4. Prefer reactive, declarative state. Use signals, computed values, and linked signals when they improve readability; keep RxJS for asynchronous streams. Derive views from state instead of synchronizing duplicate fields with subscriptions or effects. Reserve render effects for DOM work.
