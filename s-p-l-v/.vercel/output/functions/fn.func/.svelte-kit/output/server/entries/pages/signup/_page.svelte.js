import { o as onDestroy, g as get_store_value, t as tick, c as create_ssr_component, d as subscribe, f as spread, h as escape_attribute_value, i as escape_object, a as add_attribute, e as escape } from "../../../chunks/index3.js";
import * as devalue from "devalue";
import { stringify } from "devalue";
import { p as page } from "../../../chunks/stores.js";
import { d as derived, w as writable } from "../../../chunks/index2.js";
import { B as BROWSER } from "../../../chunks/prod-ssr.js";
import { t as traversePath, S as SuperFormError, c as clone, a as comparePaths, s as setPaths, m as mapErrors, f as findErrors, p as pathExists, b as traversePathsAsync } from "../../../chunks/utils.js";
import "../../../chunks/index.js";
const browser = BROWSER;
function guard$1(name) {
  return () => {
    throw new Error(`Cannot call ${name}(...) on the server`);
  };
}
const invalidateAll = guard$1("invalidateAll");
function guard(name) {
  return () => {
    throw new Error(`Cannot call ${name}(...) on the server`);
  };
}
const applyAction = guard("applyAction");
function deserialize(result) {
  const parsed = JSON.parse(result);
  if (parsed.data) {
    parsed.data = devalue.parse(parsed.data);
  }
  return parsed;
}
function enhance(form, submit = () => {
}) {
  const fallback_callback = async ({ action, result, reset }) => {
    if (result.type === "success") {
      if (reset !== false) {
        HTMLFormElement.prototype.reset.call(form);
      }
      await invalidateAll();
    }
    if (location.origin + location.pathname === action.origin + action.pathname || result.type === "redirect" || result.type === "error") {
      applyAction(result);
    }
  };
  async function handle_submit(event) {
    event.preventDefault();
    const action = new URL(
      // We can't do submitter.formAction directly because that property is always set
      // We do cloneNode for avoid DOM clobbering - https://github.com/sveltejs/kit/issues/7593
      event.submitter?.hasAttribute("formaction") ? (
        /** @type {HTMLButtonElement | HTMLInputElement} */
        event.submitter.formAction
      ) : (
        /** @type {HTMLFormElement} */
        HTMLFormElement.prototype.cloneNode.call(form).action
      )
    );
    const data = new FormData(form);
    const submitter_name = event.submitter?.getAttribute("name");
    if (submitter_name) {
      data.append(submitter_name, event.submitter?.getAttribute("value") ?? "");
    }
    const controller = new AbortController();
    let cancelled = false;
    const cancel = () => cancelled = true;
    const callback = await submit({
      action,
      cancel,
      controller,
      data,
      form,
      submitter: event.submitter
    }) ?? fallback_callback;
    if (cancelled)
      return;
    let result;
    try {
      const response = await fetch(action, {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-sveltekit-action": "true"
        },
        cache: "no-store",
        body: data,
        signal: controller.signal
      });
      result = deserialize(await response.text());
      if (result.type === "error")
        result.status = response.status;
    } catch (error) {
      if (
        /** @type {any} */
        error?.name === "AbortError"
      )
        return;
      result = { type: "error", error };
    }
    callback({
      action,
      data,
      form,
      update: (opts) => fallback_callback({ action, result, reset: opts?.reset }),
      // @ts-expect-error generic constraints stuff we don't care about
      result
    });
  }
  HTMLFormElement.prototype.addEventListener.call(form, "submit", handle_submit);
  return {
    destroy() {
      HTMLFormElement.prototype.removeEventListener.call(form, "submit", handle_submit);
    }
  };
}
const SuperDebug_svelte_svelte_type_style_lang = "";
const isElementInViewport = (el, topOffset = 0) => {
  const rect = el.getBoundingClientRect();
  return rect.top >= topOffset && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
};
const scrollToAndCenter = (el, offset = 1.125, behavior = "smooth") => {
  const elementRect = el.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.pageYOffset;
  const top = absoluteElementTop - window.innerHeight / (2 * offset);
  window.scrollTo({ left: 0, top, behavior });
};
function normalizePath(path) {
  return Array.isArray(path) ? path : [path];
}
function fieldProxy(form, path) {
  const path2 = normalizePath(path);
  const proxy = derived(form, ($form) => {
    const data = traversePath($form, path2);
    return data?.value;
  });
  return {
    subscribe(...params) {
      const unsub = proxy.subscribe(...params);
      return () => {
        unsub();
      };
    },
    //subscribe: proxy.subscribe,
    update(upd) {
      form.update((f) => {
        const output = traversePath(f, path2);
        if (output)
          output.parent[output.key] = upd(output.value);
        return f;
      });
    },
    set(value) {
      form.update((f) => {
        const output = traversePath(f, path2);
        if (output)
          output.parent[output.key] = value;
        return f;
      });
    }
  };
}
var FetchStatus;
(function(FetchStatus2) {
  FetchStatus2[FetchStatus2["Idle"] = 0] = "Idle";
  FetchStatus2[FetchStatus2["Submitting"] = 1] = "Submitting";
  FetchStatus2[FetchStatus2["Delayed"] = 2] = "Delayed";
  FetchStatus2[FetchStatus2["Timeout"] = 3] = "Timeout";
})(FetchStatus || (FetchStatus = {}));
const defaultFormOptions = {
  applyAction: true,
  invalidateAll: true,
  resetForm: false,
  autoFocusOnError: "detect",
  scrollToError: "smooth",
  errorSelector: "[data-invalid]",
  selectErrorText: false,
  stickyNavbar: void 0,
  taintedMessage: "Do you want to leave this page? Changes you made may not be saved.",
  onSubmit: void 0,
  onResult: void 0,
  onUpdate: void 0,
  onUpdated: void 0,
  onError: (event) => {
    console.warn("Unhandled Superform error, use onError event to handle it:", event.result.error);
  },
  dataType: "form",
  validators: void 0,
  defaultValidator: "keep",
  clearOnSubmit: "errors-and-message",
  delayMs: 500,
  timeoutMs: 8e3,
  multipleSubmits: "prevent",
  validation: void 0,
  SPA: void 0,
  validateMethod: "auto"
};
function superForm(form, options = {}) {
  options = { ...defaultFormOptions, ...options };
  function emptyForm(data = {}) {
    return {
      valid: false,
      errors: {},
      data,
      empty: true,
      constraints: {}
    };
  }
  function findForms(data) {
    return Object.values(data).filter((v) => isValidationObject(v) !== false);
  }
  function isValidationObject(object) {
    if (!object || typeof object !== "object")
      return false;
    if (!("valid" in object && "empty" in object && typeof object.valid === "boolean")) {
      return false;
    }
    return "id" in object && typeof object.id === "string" ? object.id : void 0;
  }
  if (typeof form === "string" && typeof options.id === "string") {
    throw new SuperFormError("You cannot specify an id both in the first superForm argument and in the options.");
  }
  const unsubscriptions = [];
  onDestroy(() => {
    unsubscriptions.forEach((unsub) => unsub());
    for (const events of Object.values(formEvents)) {
      events.length = 0;
    }
  });
  let formId = typeof form === "string" ? form : options.id ?? form?.id;
  const FormId = writable(formId);
  unsubscriptions.push(FormId.subscribe((id) => formId = id));
  {
    const postedForm = get_store_value(page).form;
    if (postedForm && typeof postedForm === "object") {
      for (const superForm2 of findForms(postedForm).reverse()) {
        if (superForm2.id === formId) {
          form = superForm2;
          break;
        }
      }
    }
  }
  function checkJson(key, value) {
    if (!value || typeof value !== "object")
      return;
    if (Array.isArray(value)) {
      if (value.length > 0)
        checkJson(key, value[0]);
    } else if (!(value instanceof Date)) {
      throw new SuperFormError(`Object found in form field "${key}". Set options.dataType = 'json' and use:enhance to use nested data structures.`);
    }
  }
  if (!form || typeof form === "string") {
    form = emptyForm();
  } else if (isValidationObject(form) === false) {
    form = emptyForm(form);
  }
  const form2 = form;
  if (options.dataType !== "json") {
    for (const [key, value] of Object.entries(form2.data)) {
      checkJson(key, value);
    }
  }
  const initialForm = clone(form2);
  const storeForm = clone(form2);
  const Valid = writable(storeForm.valid);
  const Empty = writable(storeForm.empty);
  const Message = writable(storeForm.message);
  const Errors = writable(storeForm.errors);
  const Constraints = writable(storeForm.constraints);
  const Meta = writable(storeForm.meta);
  let taintedFormState = clone(initialForm.data);
  const _formData = writable(storeForm.data);
  const Form = {
    subscribe: _formData.subscribe,
    set: (value, options2 = {}) => {
      checkTainted(value, taintedFormState, options2.taint ?? true);
      taintedFormState = clone(value);
      return _formData.set(value);
    },
    update: (updater, options2 = {}) => {
      return _formData.update((value) => {
        const output = updater(value);
        checkTainted(output, taintedFormState, options2.taint ?? true);
        taintedFormState = clone(value);
        return output;
      });
    }
  };
  const LastChanges = writable([]);
  function checkTainted(newObj, compareAgainst, options2) {
    if (options2 === false) {
      return;
    } else if (options2 === "untaint-all") {
      Tainted.set(void 0);
      return;
    }
    const paths = comparePaths(newObj, compareAgainst);
    if (options2 === true) {
      LastChanges.set(paths);
    }
    if (paths.length) {
      Tainted.update((tainted) => {
        if (!tainted)
          tainted = {};
        setPaths(tainted, paths, options2 === true ? true : void 0);
        return tainted;
      });
    }
  }
  const Tainted = writable();
  const Submitting = writable(false);
  const Delayed = writable(false);
  const Timeout = writable(false);
  const AllErrors = derived(Errors, ($errors) => {
    if (!$errors)
      return [];
    return findErrors($errors);
  });
  const FirstError = derived(AllErrors, ($all) => $all[0] ?? null);
  if (typeof initialForm.valid !== "boolean") {
    throw new SuperFormError("A non-validation object was passed to superForm. Check what's passed to its first parameter (null/undefined is allowed).");
  }
  if (options.SPA && options.validators === void 0) {
    console.warn("No validators set for Superform in SPA mode. Add them to the validators option, or set it to false to disable this warning.");
  }
  const _taintedMessage = options.taintedMessage;
  options.taintedMessage = void 0;
  function enableTaintedMessage() {
    options.taintedMessage = _taintedMessage;
  }
  function rebind(form3, untaint, message) {
    if (untaint) {
      Tainted.set(typeof untaint === "boolean" ? void 0 : untaint);
      taintedFormState = clone(form3.data);
    }
    message = message ?? form3.message;
    Form.set(form3.data);
    Message.set(message);
    Empty.set(form3.empty);
    Valid.set(form3.valid);
    Errors.set(form3.errors);
    Meta.set(form3.meta);
    FormId.set(form3.id);
    if (options.flashMessage && shouldSyncFlash(options)) {
      const flash = options.flashMessage.module.getFlash(page);
      if (message && get_store_value(flash) === void 0) {
        flash.set(message);
      }
    }
  }
  async function _update(form3, untaint) {
    let cancelled = false;
    const data = {
      form: form3,
      cancel: () => cancelled = true
    };
    for (const event of formEvents.onUpdate) {
      await event(data);
    }
    if (cancelled) {
      if (options.flashMessage)
        cancelFlash(options);
      return;
    }
    if (form3.valid && options.resetForm && (options.resetForm === true || await options.resetForm())) {
      _resetForm(form3.message);
    } else {
      rebind(form3, untaint);
    }
    if (formEvents.onUpdated.length) {
      await tick();
    }
    for (const event of formEvents.onUpdated) {
      event({ form: form3 });
    }
  }
  function _resetForm(message) {
    rebind(clone(initialForm), true, message);
  }
  const Form_update = async (result, untaint) => {
    if (result.type == "error") {
      throw new SuperFormError(`ActionResult of type "${result.type}" cannot be passed to update function.`);
    }
    if (result.type == "redirect") {
      if (options.resetForm && (options.resetForm === true || await options.resetForm())) {
        _resetForm();
      }
      return;
    }
    if (typeof result.data !== "object") {
      throw new SuperFormError("Non-object validation data returned from ActionResult.");
    }
    const forms = findForms(result.data);
    if (!forms.length) {
      throw new SuperFormError("No form data returned from ActionResult. Make sure you return { form } in the form actions.");
    }
    for (const newForm of forms) {
      if (newForm.id !== formId)
        continue;
      await _update(newForm, untaint ?? (result.status >= 200 && result.status < 300));
    }
  };
  const formEvents = {
    onSubmit: options.onSubmit ? [options.onSubmit] : [],
    onResult: options.onResult ? [options.onResult] : [],
    onUpdate: options.onUpdate ? [options.onUpdate] : [],
    onUpdated: options.onUpdated ? [options.onUpdated] : [],
    onError: options.onError ? [options.onError] : []
  };
  const Fields = Object.fromEntries(Object.keys(initialForm.data).map((key) => {
    return [key, Fields_create(key, initialForm)];
  }));
  function Fields_create(key, validation) {
    return {
      name: key,
      value: fieldProxy(Form, key),
      errors: fieldProxy(Errors, key),
      constraints: fieldProxy(Constraints, key),
      type: validation.meta?.types[key]
    };
  }
  return {
    form: Form,
    formId: FormId,
    errors: Errors,
    message: Message,
    constraints: Constraints,
    meta: derived(Meta, ($m) => $m),
    fields: Fields,
    tainted: Tainted,
    valid: derived(Valid, ($s) => $s),
    empty: derived(Empty, ($e) => $e),
    submitting: derived(Submitting, ($s) => $s),
    delayed: derived(Delayed, ($d) => $d),
    timeout: derived(Timeout, ($t) => $t),
    options,
    capture: () => ({
      valid: get_store_value(Valid),
      errors: get_store_value(Errors),
      data: get_store_value(Form),
      empty: get_store_value(Empty),
      constraints: get_store_value(Constraints),
      message: get_store_value(Message),
      id: formId,
      meta: get_store_value(Meta),
      tainted: get_store_value(Tainted)
    }),
    restore: (snapshot) => {
      rebind(snapshot, snapshot.tainted ?? true);
    },
    validate: (path, opts) => {
      return validateField(Array.isArray(path) ? path : [path], options.validators, options.defaultValidator, Form, Errors, opts);
    },
    enhance: (el, events) => {
      if (events) {
        if (events.onError) {
          if (options.onError === "apply") {
            throw new SuperFormError('options.onError is set to "apply", cannot add any onError events.');
          } else if (events.onError === "apply") {
            throw new SuperFormError('Cannot add "apply" as onError event in use:enhance.');
          }
          formEvents.onError.push(events.onError);
        }
        if (events.onResult)
          formEvents.onResult.push(events.onResult);
        if (events.onSubmit)
          formEvents.onSubmit.push(events.onSubmit);
        if (events.onUpdate)
          formEvents.onUpdate.push(events.onUpdate);
        if (events.onUpdated)
          formEvents.onUpdated.push(events.onUpdated);
      }
      return formEnhance(el, Submitting, Delayed, Timeout, Errors, Form_update, options, Form, Message, enableTaintedMessage, formEvents, FormId, Meta, Constraints, Tainted, LastChanges);
    },
    firstError: FirstError,
    allErrors: AllErrors,
    reset: (options2) => _resetForm(options2?.keepMessage ? get_store_value(Message) : void 0)
  };
}
function cancelFlash(options) {
  if (!options.flashMessage || !browser)
    return;
  if (!shouldSyncFlash(options))
    return;
  document.cookie = `flash=; Max-Age=0; Path=${options.flashMessage.cookiePath ?? "/"};`;
}
function shouldSyncFlash(options) {
  if (!options.flashMessage || !browser)
    return false;
  return options.syncFlashMessage;
}
async function validateField(path, validators, defaultValidator, data, errors, options = {}) {
  if (options.update === void 0)
    options.update = true;
  if (options.taint === void 0)
    options.taint = false;
  function setError(errorMsgs) {
    if (typeof errorMsgs === "string")
      errorMsgs = [errorMsgs];
    if (options.update === true || options.update == "errors") {
      errors.update((errors2) => {
        const error = traversePath(errors2, path, (node) => {
          if (node.value === void 0) {
            node.parent[node.key] = {};
            return node.parent[node.key];
          } else {
            return node.value;
          }
        });
        if (!error)
          throw new SuperFormError("Error path could not be created: " + path);
        error.parent[error.key] = errorMsgs ?? void 0;
        return errors2;
      });
    }
    return errorMsgs ?? void 0;
  }
  async function defaultValidate() {
    if (defaultValidator == "clear") {
      setError(void 0);
    }
    return void 0;
  }
  let value = options.value;
  const currentData = get_store_value(data);
  if (!("value" in options)) {
    const dataToValidate = traversePath(currentData, path);
    if (!dataToValidate) {
      throw new SuperFormError("Validation data not found: " + path);
    }
    value = dataToValidate.value;
  } else if (options.update === true || options.update === "value") {
    data.update(($data) => {
      setPaths($data, [path], value);
      return $data;
    }, { taint: options.taint });
  }
  if (typeof validators !== "object") {
    return defaultValidate();
  }
  const validationPath = path.filter((p) => isNaN(parseInt(p)));
  function extractValidator(data2, key) {
    const def = data2?._def;
    if (def) {
      const objectShape = "shape" in def ? def.shape() : def.schema?.shape;
      if (objectShape)
        return objectShape[key];
      const arrayShape = data2?.element?.shape;
      if (arrayShape)
        return arrayShape[key];
    }
    throw new SuperFormError("Invalid Zod validator for " + key + ": " + data2);
  }
  if ("safeParseAsync" in validators) {
    const validator = traversePath(validators, validationPath, (data2) => {
      return extractValidator(data2.parent, data2.key);
    });
    if (!validator)
      throw new SuperFormError("No Zod validator found: " + path);
    const result = await extractValidator(validator.parent, validator.key).safeParseAsync(value);
    if (!result.success) {
      const msgs = mapErrors(result.error.format());
      return setError(options.errors ?? msgs._errors);
    } else {
      return setError(void 0);
    }
  } else {
    const validationPath2 = path.filter((p) => isNaN(parseInt(p)));
    const validator = traversePath(validators, validationPath2);
    if (!validator) {
      throw new SuperFormError("No Superforms validator found: " + path);
    } else if (validator.value === void 0) {
      return defaultValidate();
    } else {
      const result = validator.value(value);
      return setError(result ? options.errors ?? result : result);
    }
  }
}
function formEnhance(formEl, submitting, delayed, timeout, errs, Data_update, options, data, message, enableTaintedForm, formEvents, id, meta, constraints, tainted, lastChanges) {
  enableTaintedForm();
  const errors = errs;
  function equal(one, other) {
    return one.map((v) => v.join()).join() == other.map((v) => v.join()).join();
  }
  let lastBlur = [];
  function checkBlur() {
    if (options.validationMethod == "oninput" || options.validationMethod == "submit-only") {
      return;
    }
    const newChanges = get_store_value(lastChanges);
    if (options.validationMethod != "onblur" && equal(newChanges, lastBlur)) {
      return;
    }
    lastBlur = newChanges;
    for (const change of newChanges) {
      validateField(change, options.validators, options.defaultValidator, data, errors);
    }
  }
  formEl.addEventListener("focusout", checkBlur);
  function checkInput() {
    if (options.validationMethod == "onblur" || options.validationMethod == "submit-only") {
      return;
    }
    const errorContent = get_store_value(errors);
    const taintedContent = get_store_value(tainted);
    for (const change of get_store_value(lastChanges)) {
      let shouldValidate = options.validationMethod === "oninput";
      if (!shouldValidate) {
        const isTainted = taintedContent && pathExists(taintedContent, change, (value) => value === true);
        const errorNode = errorContent ? pathExists(errorContent, change) : void 0;
        const hasError = errorNode && errorNode.key in errorNode.parent;
        shouldValidate = !!isTainted && !!hasError;
      }
      if (shouldValidate) {
        validateField(change, options.validators, options.defaultValidator, data, errors);
      }
    }
  }
  formEl.addEventListener("input", checkInput);
  const ErrorTextEvents = /* @__PURE__ */ new Set();
  function ErrorTextEvents_selectText(e) {
    const target = e.target;
    if (options.selectErrorText)
      target.select();
  }
  function ErrorTextEvents_addErrorTextListeners(formEl2) {
    formEl2.querySelectorAll("input").forEach((el) => {
      el.addEventListener("invalid", ErrorTextEvents_selectText);
    });
  }
  function ErrorTextEvents_removeErrorTextListeners(formEl2) {
    formEl2.querySelectorAll("input").forEach((el) => el.removeEventListener("invalid", ErrorTextEvents_selectText));
  }
  onDestroy(() => {
    ErrorTextEvents.forEach((formEl2) => ErrorTextEvents_removeErrorTextListeners(formEl2));
    ErrorTextEvents.clear();
    formEl.removeEventListener("focusout", checkBlur);
    formEl.removeEventListener("input", checkInput);
  });
  function Form(formEl2) {
    function rebind() {
      if (options.selectErrorText) {
        if (Form2 && formEl2 !== Form2) {
          ErrorTextEvents_removeErrorTextListeners(Form2);
          ErrorTextEvents.delete(Form2);
        }
        if (!ErrorTextEvents.has(formEl2)) {
          ErrorTextEvents_addErrorTextListeners(formEl2);
          ErrorTextEvents.add(formEl2);
        }
      }
      Form2 = formEl2;
    }
    let Form2;
    function Form_shouldAutoFocus(userAgent) {
      if (typeof options.autoFocusOnError === "boolean")
        return options.autoFocusOnError;
      else
        return !/iPhone|iPad|iPod|Android/i.test(userAgent);
    }
    const Form_scrollToFirstError = async () => {
      if (options.scrollToError == "off")
        return;
      const selector = options.errorSelector;
      if (!selector)
        return;
      await tick();
      let el;
      el = Form2.querySelector(selector);
      if (!el)
        return;
      el = el.querySelector(selector) ?? el;
      const nav = options.stickyNavbar ? document.querySelector(options.stickyNavbar) : null;
      if (!isElementInViewport(el, nav?.offsetHeight ?? 0)) {
        scrollToAndCenter(el, void 0, options.scrollToError);
      }
      if (!Form_shouldAutoFocus(navigator.userAgent))
        return;
      let focusEl;
      focusEl = el;
      if (!["INPUT", "SELECT", "BUTTON", "TEXTAREA"].includes(focusEl.tagName)) {
        focusEl = focusEl.querySelector('input:not([type="hidden"]):not(.flatpickr-input), select, textarea');
      }
      if (focusEl) {
        try {
          focusEl.focus({ preventScroll: true });
          if (options.selectErrorText && focusEl.tagName == "INPUT") {
            focusEl.select();
          }
        } catch (err) {
        }
      }
    };
    rebind();
    {
      let state = FetchStatus.Idle;
      let delayedTimeout, timeoutTimeout;
      const setState = (s) => {
        state = s;
        submitting.set(state >= FetchStatus.Submitting);
        delayed.set(state >= FetchStatus.Delayed);
        timeout.set(state >= FetchStatus.Timeout);
      };
      return {
        submitting: () => {
          rebind();
          setState(state != FetchStatus.Delayed ? FetchStatus.Submitting : FetchStatus.Delayed);
          if (delayedTimeout)
            clearTimeout(delayedTimeout);
          if (timeoutTimeout)
            clearTimeout(timeoutTimeout);
          delayedTimeout = window.setTimeout(() => {
            if (state == FetchStatus.Submitting)
              setState(FetchStatus.Delayed);
          }, options.delayMs);
          timeoutTimeout = window.setTimeout(() => {
            if (state == FetchStatus.Delayed)
              setState(FetchStatus.Timeout);
          }, options.timeoutMs);
        },
        completed: (cancelled) => {
          if (delayedTimeout)
            clearTimeout(delayedTimeout);
          if (timeoutTimeout)
            clearTimeout(timeoutTimeout);
          delayedTimeout = timeoutTimeout = 0;
          setState(FetchStatus.Idle);
          if (!cancelled)
            setTimeout(Form_scrollToFirstError);
        },
        scrollToFirstError: () => setTimeout(Form_scrollToFirstError),
        isSubmitting: () => state === FetchStatus.Submitting || state === FetchStatus.Delayed
      };
    }
  }
  const htmlForm = Form(formEl);
  let currentRequest;
  return enhance(formEl, async (submit) => {
    let cancelled = false;
    function cancel() {
      cancelled = true;
      return submit.cancel();
    }
    if (htmlForm.isSubmitting() && options.multipleSubmits == "prevent") {
      cancel();
    } else {
      if (htmlForm.isSubmitting() && options.multipleSubmits == "abort") {
        if (currentRequest)
          currentRequest.abort();
      }
      currentRequest = submit.controller;
      const data2 = { ...submit, cancel };
      for (const event of formEvents.onSubmit) {
        await event(data2);
      }
    }
    if (cancelled) {
      if (options.flashMessage)
        cancelFlash(options);
    } else {
      if (options.validators) {
        const checkData = get_store_value(data);
        let valid;
        let clientErrors = {};
        if ("safeParseAsync" in options.validators) {
          const validator = options.validators;
          const result = await validator.safeParseAsync(checkData);
          valid = result.success;
          if (!result.success) {
            clientErrors = mapErrors(result.error.format());
          }
        } else {
          valid = true;
          const validator = options.validators;
          const newErrors = [];
          await traversePathsAsync(checkData, async ({ value, path }) => {
            const validationPath = path.filter((p) => isNaN(parseInt(p)));
            const maybeValidator = traversePath(validator, validationPath);
            if (typeof maybeValidator?.value === "function") {
              const check = maybeValidator.value;
              if (Array.isArray(value)) {
                for (const key in value) {
                  const errors2 = await check(value[key]);
                  if (errors2) {
                    valid = false;
                    newErrors.push({
                      path: path.concat([key]),
                      errors: typeof errors2 === "string" ? [errors2] : errors2 ?? void 0
                    });
                  }
                }
              } else {
                const errors2 = await check(value);
                if (errors2) {
                  valid = false;
                  newErrors.push({
                    path,
                    errors: typeof errors2 === "string" ? [errors2] : errors2 ?? void 0
                  });
                }
              }
            }
          });
          for (const { path, errors: errors2 } of newErrors) {
            const errorPath = traversePath(clientErrors, path, ({ parent, key, value }) => {
              if (value === void 0)
                parent[key] = {};
              return parent[key];
            });
            if (errorPath) {
              const { parent, key } = errorPath;
              parent[key] = errors2;
            }
          }
        }
        if (!valid) {
          cancel();
          const validationResult = {
            valid,
            errors: clientErrors,
            data: checkData,
            empty: false,
            constraints: get_store_value(constraints),
            message: void 0,
            id: get_store_value(id),
            meta: get_store_value(meta)
          };
          const result = {
            type: "failure",
            status: (typeof options.SPA === "boolean" ? void 0 : options.SPA?.failStatus) ?? 400,
            data: { form: validationResult }
          };
          setTimeout(() => validationResponse({ result }), 0);
        }
      }
      if (!cancelled) {
        switch (options.clearOnSubmit) {
          case "errors-and-message":
            errors.set({});
            message.set(void 0);
            break;
          case "errors":
            errors.set({});
            break;
          case "message":
            message.set(void 0);
            break;
        }
        if (options.flashMessage && (options.clearOnSubmit == "errors-and-message" || options.clearOnSubmit == "message") && shouldSyncFlash(options)) {
          options.flashMessage.module.getFlash(page).set(void 0);
        }
        htmlForm.submitting();
        if (options.SPA) {
          cancel();
          const validationResult = {
            valid: true,
            errors: {},
            data: get_store_value(data),
            empty: false,
            constraints: get_store_value(constraints),
            message: void 0,
            id: get_store_value(id),
            meta: get_store_value(meta)
          };
          const result = {
            type: "success",
            status: 200,
            data: { form: validationResult }
          };
          setTimeout(() => validationResponse({ result }), 0);
        } else if (options.dataType === "json") {
          const postData = get_store_value(data);
          const chunks = chunkSubstr(stringify(postData), 5e5);
          for (const chunk of chunks) {
            submit.data.append("__superform_json", chunk);
          }
          Object.keys(postData).forEach((key) => {
            if (typeof submit.data.get(key) === "string") {
              submit.data.delete(key);
            }
          });
        }
      }
    }
    function chunkSubstr(str, size) {
      const numChunks = Math.ceil(str.length / size);
      const chunks = new Array(numChunks);
      for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substring(o, o + size);
      }
      return chunks;
    }
    async function validationResponse(event) {
      const result = event.result;
      currentRequest = null;
      let cancelled2 = false;
      const data2 = {
        result,
        formEl,
        cancel: () => cancelled2 = true
      };
      for (const event2 of formEvents.onResult) {
        await event2(data2);
      }
      if (!cancelled2) {
        if (result.type !== "error") {
          if (result.type === "success" && options.invalidateAll) {
            await invalidateAll();
          }
          if (options.applyAction) {
            await applyAction(result);
          } else {
            await Data_update(result);
          }
        } else {
          if (options.applyAction) {
            if (options.onError == "apply") {
              await applyAction(result);
            } else {
              await applyAction({
                type: "failure",
                status: Math.floor(result.status || 500)
              });
            }
          }
          if (options.onError !== "apply") {
            const data3 = { result, message };
            for (const event2 of formEvents.onError) {
              if (event2 !== "apply")
                await event2(data3);
            }
          }
        }
        if (options.flashMessage) {
          if (result.type == "error" && options.flashMessage.onError) {
            await options.flashMessage.onError({
              result,
              message: options.flashMessage.module.getFlash(page)
            });
          } else if (result.type != "error") {
            await options.flashMessage.module.updateFlash(page);
          }
        }
      } else {
        if (options.flashMessage)
          cancelFlash(options);
      }
      htmlForm.completed(cancelled2);
    }
    return validationResponse;
  });
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $errors, $$unsubscribe_errors;
  let $constraints, $$unsubscribe_constraints;
  let $form, $$unsubscribe_form;
  let { data } = $$props;
  const { form, errors, constraints } = superForm(data.form);
  $$unsubscribe_form = subscribe(form, (value) => $form = value);
  $$unsubscribe_errors = subscribe(errors, (value) => $errors = value);
  $$unsubscribe_constraints = subscribe(constraints, (value) => $constraints = value);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_errors();
  $$unsubscribe_constraints();
  $$unsubscribe_form();
  return `



<div class="hero"><div class="hero-content flex-col lg:flex-row-reverse"><div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100"><div class="card-body"><h2 class="card-title">Login</h2>
            <form method="POST"><div class="p-2"><label for="name" class="font-bold">Your full name</label><br>
                <input${spread(
    [
      { type: "text" },
      { id: "name" },
      { name: "name" },
      {
        class: "input input-bordered w-full max-w-xs"
      },
      {
        "data-invalid": escape_attribute_value($errors.name)
      },
      escape_object($constraints.name)
    ],
    {}
  )}${add_attribute("value", $form.name, 0)}>
                    ${$errors.name ? `<span class="text-rose-500">${escape($errors.name)}</span>` : ``}
                    <br></div>
                <div class="p-2"><label for="username" class="font-bold">Username</label><br>        
                <input${spread(
    [
      { type: "text" },
      { id: "username" },
      { name: "username" },
      {
        class: "input input-bordered w-full max-w-xs"
      },
      {
        "data-invalid": escape_attribute_value($errors.username)
      },
      escape_object($constraints.username)
    ],
    {}
  )}${add_attribute("value", $form.username, 0)}>
                    ${$errors.username ? `<span class="text-rose-500">${escape($errors.username)}</span>` : ``}
                    <br></div>
                <div class="p-2"><label for="email" class="font-bold">E-mail</label><br>
                <input${spread(
    [
      { type: "text" },
      { id: "email" },
      { name: "email" },
      {
        class: "input input-bordered w-full max-w-xs"
      },
      {
        "data-invalid": escape_attribute_value($errors.email)
      },
      escape_object($constraints.email)
    ],
    {}
  )}${add_attribute("value", $form.email, 0)}>
                    ${$errors.email ? `<span class="text-rose-500">${escape($errors.email)}</span>` : ``}
                    <br></div>
                <div class="p-2"><label for="password" class="font-bold">Password</label><br>
                <input${spread(
    [
      { type: "password" },
      { id: "password" },
      { name: "password" },
      {
        class: "input input-bordered w-full max-w-xs"
      },
      {
        "data-invalid": escape_attribute_value($errors.password)
      },
      escape_object($constraints.password)
    ],
    {}
  )}${add_attribute("value", $form.password, 0)}>
                    ${$errors.password ? `<span class="text-rose-500">${escape($errors.password)}</span>` : ``}
                    <br></div>
                <div class="p-2"><input type="submit" value="Signup" class="btn"></div></form></div></div></div></div>`;
});
export {
  Page as default
};
