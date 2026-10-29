# Style rules

These rules apply to styles throughout the repository.

1. Keep mobile and other responsive overrides inside the corresponding selector block, alongside its base declarations. Do not collect mobile overrides in a separate media-query section at the end of the stylesheet.
2. Separate style groups with a blank line: between selector blocks, before nested selectors or media queries, and after nested blocks when another group follows.
3. Prefer class selectors over element selectors. Add descriptive classes to template elements instead of styling tags such as `h1`, `p`, or `button`. Use element selectors only when a class-based approach would be impractical, such as global resets or styling markup outside the application's control.

For example:

```scss
.brand {
  display: flex;
  align-items: center;
  gap: 26px;
  margin-bottom: 40px;

  @media (max-width: 600px) {
    gap: 18px;
    margin-bottom: 30px;
  }

  &-title {
    margin: 0 0 3px;
    font-size: 36px;
    line-height: 1.2;
    letter-spacing: -1px;

    @media (max-width: 600px) {
      font-size: 30px;
    }
  }

  &-description {
    margin: 0;
    color: #818896;
    font-size: 20px;

    @media (max-width: 600px) {
      font-size: 17px;
    }
  }
}
```

# Angular initialization rules

These rules apply to Angular code throughout the repository.

1. Keep field initializers simple. Move complex initialization, such as long RxJS pipelines, multi-step setup, or substantial branching, into the constructor or an appropriate lifecycle hook.
2. Preserve initialization dependencies and use explicit field types when assigning fields later. Prefer the constructor for APIs that require an injection context, such as `toSignal`; when using them in a lifecycle hook, supply the required injector explicitly. Keep derived state reactive rather than introducing duplicate state or synchronization subscriptions.

# JSON Editor rules

These rules apply to all files under `apps/json-editor`.

1. Do not use the TypeScript `readonly` modifier.
2. Order class members as follows: public fields, private fields, lifecycle methods, public methods, and private methods. Treat getters and setters as methods with their declared visibility. When a constructor is needed, place it after private fields and before lifecycle methods. Preserve initialization dependencies; initialize public fields in the constructor when they depend on private fields declared below them.
3. Do not insert blank lines between fields in the same group. Keep inputs, outputs, other public fields, and private fields as separate groups, with one blank line between groups. Keep each input or output decorator on the same line as its field.
4. Prefer reactive, declarative state. Use signals, computed values, and linked signals when they improve readability; keep RxJS for asynchronous streams. Derive views from state instead of synchronizing duplicate fields with subscriptions or effects. Reserve render effects for DOM work.
