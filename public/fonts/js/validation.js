
document.addEventListener("DOMContentLoaded", function () {

    const forms = document.querySelectorAll(".wpcf7-form");

    forms.forEach(function (form) {

        form.addEventListener("submit", function (e) {

            let isValid = true;

            const inputs = form.querySelectorAll("input, textarea, select");

            inputs.forEach(function (input) {

                const value = input.value.trim();

                // Remove old error
                input.classList.remove("is-invalid");

                // Required validation
                if (input.hasAttribute("required") && value === "") {
                    isValid = false;
                    input.classList.add("is-invalid");
                }

                // Email validation
                if (input.type === "email" && value !== "") {
                    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
                    if (!emailPattern.test(value)) {
                        isValid = false;
                        input.classList.add("is-invalid");
                    }
                }

                // Phone validation (10 digit)
                if (input.type === "tel" && value !== "") {
                    const phonePattern = /^[0-9]{10}$/;
                    if (!phonePattern.test(value)) {
                        isValid = false;
                        input.classList.add("is-invalid");
                    }
                }

            });

            if (!isValid) {
                e.preventDefault();
                alert("Please fill all required fields correctly.");
            }

        });

    });

});
