var XHR = (function () {
    async function _send(options) {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            var button;
            if (options.isForm || options.button) {
                if (options.isForm) {
                    button = options.form.querySelector(
                        'button[type="submit"]'
                    );
                } else {
                    button = options.button;
                }
                buttonStyle(button);
            }

            if (options.isForm) {
                xhr.open(
                    options.form.getAttribute("method"),
                    options.form.getAttribute("action"),
                    true
                );
            } else {
                if (options.method === "GET" || !options.method) {
                    if (options.data && typeof options.data === "object") {
                        var params = Object.entries(options.data)
                            .map(([key, value]) => `${key}=${value}`)
                            .join("&");
                        options.url = options.url + "?" + params;
                    }
                }
                xhr.open(options.method ?? "GET", options.url, true);
            }
            configHeader(xhr);
            if ("headers" in options) {
                pushHeaders(xhr, options.headers);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    var status = xhr.status;
                    buttonDone(options);
                    if (status === 0 || (status >= 200 && status < 400)) {
                        var dataResponse = isJson(xhr.responseText)
                            ? JSON.parse(xhr.responseText)
                            : xhr.responseText;
                        resetButton(button);
                        if (options.callback) {
                            resolve(
                                callFunction(options.callback, [
                                    dataResponse,
                                    options.button,
                                    options.isForm,
                                ])
                            );
                        } else {
                            resolve(dataResponse);
                        }
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText,
                        });
                    }
                }
            };

            xhr.onerror = function () {
                buttonDone(options);
                reject({
                    status: this.status,
                    statusText: xhr.statusText,
                });
            };

            if (options.formData) {
                xhr.send(options.formData);
            } else if (options.isForm || options.method === "POST") {
                new FormData();
                var dataValues = {};
                if (options.form) {
                    var enableInputs = options.form.querySelectorAll(
                        "[name]:not([disabled])"
                    );
                    dataValues = getDataValues(enableInputs);
                } else if (options.data) {
                    dataValues = options.data;
                }

                let { data, formData } = buildFormData(dataValues);
                if ("type" in options && options.type == "JSON") {
                    pushHeaders(xhr, { "Content-type": "application/json" });
                    xhr.send(data);
                } else {
                    xhr.send(formData);
                }
            } else {
                xhr.send();
            }
        });
    }

    function pushHeaders(xhr, headers) {
        for (const [key, value] of Object.entries(headers)) {
            xhr.setRequestHeader(key, value);
        }
    }

    function resetButton(button) {
        if (button != null) {
            Object.assign(button.style, {
                width: ``,
                height: ``,
                position: "",
            });
        }
    }

    function getDataValues(enableInputs, noCheckAndNoValue = false) {
        var dataValues = Array.from(enableInputs).reduce(function (
            values,
            input
        ) {
            if (!input.value && !noCheckAndNoValue) return values;
            switch (input.type) {
                case "radio":
                    var radioChecked = input.parentElement.querySelector(
                        `input[name="${input.name}"]:checked`
                    );
                    if (radioChecked !== null) {
                        values[input.name] = radioChecked.value;
                    }
                    break;
                case "checkbox":
                    if (
                        !values[input.name] &&
                        (input.matches(":checked") || noCheckAndNoValue)
                    ) {
                        values[input.name] = input.value;
                        break;
                    }

                    if (!input.matches(":checked")) {
                        break;
                    }

                    if (input.matches(":checked") || noCheckAndNoValue) {
                        if (!Array.isArray(values[input.name])) {
                            values[input.name] = [values[input.name]];
                        }
                        values[input.name].push(input.value);
                    } else if (values[input.name] === undefined) {
                        values[input.name] = "";
                    }
                    break;
                case "file":
                    if (input.name.indexOf("[]") > -1) {
                        if (!Array.isArray(values[input.name])) {
                            values[input.name] = [];
                        }
                        values[input.name].push(...input.files);
                    } else {
                        if (input.files.length > 0) {
                            values[input.name] = input.files[0];
                        } else {
                            values[input.name] = "";
                        }
                    }
                    break;
                case "select-multiple":
                    const selectOptions =
                        input.querySelectorAll("option:checked");
                    selectOptions.forEach(function (optionEl) {
                        if (!Array.isArray(values[input.name])) {
                            values[input.name] = [];
                        }
                        values[input.name].push(optionEl.value);
                    });
                    break;
                default:
                    if (input.name.indexOf("[]") > -1) {
                        if (!Array.isArray(values[input.name])) {
                            values[input.name] = [];
                        }
                        values[input.name].push(input.value);
                    } else {
                        values[input.name] = input.value;
                    }
                    break;
            }
            return values;
        },
        {});
        return dataValues;
    }

    function buildFormData(data) {
        const formData = new FormData();

        for (const [key, value] of Object.entries(data)) {
            if (
                key.indexOf("[]") > -1 ||
                (value instanceof Array && value.length > 1)
            ) {
                value.forEach(function (val) {
                    formData.append(
                        key.indexOf("[]") > -1 ? key : key + "[]",
                        val
                    );
                });
            } else if (value instanceof Array) {
                formData.append(key, value);
            } else {
                formData.append(key, value);
            }
        }

        return { data, formData };
    }

    function buttonStyle(button) {
        const styles = getComputedStyle(button);
        const buttonRect = button.getBoundingClientRect();
        Object.assign(button.style, {
            width: `${buttonRect.width}px`,
            height: `${buttonRect.height}px`,
            position:
                styles.position == "static" ? "relative" : styles.position,
        });
        button.setAttribute("content-old", button.innerHTML);
        button.disabled = true;
        button.innerHTML = `<div class="r-s-loader"></div><style>.r-s-loader{position:absolute;left:50%;top:50%;border:5px solid ${
            styles.color
        };border-radius:50%;border-top:5px solid ${
            styles.color
        };border-bottom:5px solid ${
            styles.color
        };border-left:5px solid transparent;border-right:5px solid transparent;width:${
            buttonRect.height - 16
        }px;height:${
            buttonRect.height - 16
        }px;-webkit-animation:spin 2s linear infinite;animation:spin 2s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:translate(-50%,-50%) rotate(0)}100%{-webkit-transform:translate(-50%,-50%) rotate(360deg)}}@keyframes spin{0%{transform:translate(-50%,-50%) rotate(0)}100%{transform:translate(-50%,-50%) rotate(360deg)}}</style>`;
    }

    function buttonDone(options) {
        if (options.isForm || options.button) {
            var button;
            if (options.isForm) {
                button = options.form.querySelector('button[type="submit"]');
            } else {
                button = options.button;
            }
            button.disabled = false;
            button.innerHTML = button.getAttribute("content-old");
        }
    }

    function isJson(item) {
        item = typeof item !== "string" ? JSON.stringify(item) : item;

        try {
            item = JSON.parse(item);
        } catch (e) {
            return false;
        }

        if (typeof item === "object" && item !== null) {
            return true;
        }

        return false;
    }

    function configHeader(xhr) {
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        const csrfTokenLaravel = document.querySelector(
            'meta[name="csrf-token"]'
        );
        if (csrfTokenLaravel) {
            xhr.setRequestHeader("X-CSRF-TOKEN", csrfTokenLaravel.content);
            xhr.setRequestHeader(
                "Access-Control-Allow-Origin",
                window.location.origin
            );
            xhr.setRequestHeader(
                "Access-Control-Allow-Methods",
                "DELETE, POST, GET, OPTIONS"
            );
            xhr.setRequestHeader(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization, X-Requested-With"
            );
        }
    }

    function callFunction(func, options = []) {
        var arrayFunc = func.split(".");
        var method;
        if (arrayFunc.length === 1) {
            method = arrayFunc[0];
            return (
                null != window[method] &&
                typeof window[method] === "function" &&
                window[method](...options)
            );
        } else if (arrayFunc.length === 2) {
            var obj = arrayFunc[0];
            method = arrayFunc[1];
            return (
                window[obj] != null &&
                typeof window[obj] === "object" &&
                null != window[obj][method] &&
                typeof window[obj][method] === "function" &&
                window[obj][method](...options)
            );
        }
    }
    return {
        send: async function (data) {
            return await _send(data);
        },
    };
})();