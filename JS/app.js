// ========================================
// CVPRO NIGERIA - SUPABASE CONNECTION
// ========================================

const SUPABASE_URL = "https://ifmcgytomcufemnretre.supabase.co";

const SUPABASE_KEY = "sb_publishable_vFK8hlCEv67_MJivvAEOag_xYsl9iDY";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ========================================
// ORDER FORM
// ========================================

const orderForm = document.getElementById("order-form");

if (orderForm) {

    orderForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const submitButton =
            document.querySelector(".submit-button");

        const formMessage =
            document.getElementById("form-message");


        // Get form values

        const planSelect =
    document.getElementById("plan");

const plan =
    planSelect.value;

const price =
    Number(
        planSelect.options[
            planSelect.selectedIndex
        ].dataset.price
    );

    const now = new Date();

const datePart =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

const randomPart =
    Math.floor(1000 + Math.random() * 9000);

const orderReference =
    `CVP-${datePart}-${randomPart}`;

        const fullName =
            document.getElementById("full-name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const location =
            document.getElementById("location").value.trim();

        const education =
            document.getElementById("education").value.trim();

        const experience =
            document.getElementById("experience").value.trim();

        const skills =
            document.getElementById("skills").value.trim();

        const additional =
            document.getElementById("additional").value.trim();


        // Change button

        submitButton.disabled = true;

        submitButton.textContent =
            "Submitting...";


        formMessage.textContent = "";

        const {
    data: {
        user
    },
    error: authError
} = await supabaseClient.auth.getUser();

if (authError) {
    console.error("Auth error:", authError);
}

if (!user) {
    formMessage.textContent =
        "Please log in before submitting your order.";
    formMessage.style.color = "#d62828";
    return;
}

console.log("Customer user ID:", user.id);

        try {

            const { data, error } = await supabaseClient
    .from("orders")
    .insert([{
        user_id: user.id,
        plan: plan,
        price: price,
        order_reference: orderReference,
        full_name: fullName,
        email: email,
        phone: phone,
        location: location,
        education: education,
        experience: experience,
        skills: skills,
        additional: additional,
        status: "pending"
    }]);

console.log("Order inserted for user:", user.id);


            if (error) {

                console.error(
                    "Supabase error:",
                    error
                );

                throw error;
            }


            // Success

formMessage.textContent = "";

const orderSuccess =
    document.getElementById("order-success");

const successReference =
    document.getElementById("success-reference");

const successPlan =
    document.getElementById("success-plan");

const successPrice =
    document.getElementById("success-price");

const successWhatsApp =
    document.getElementById("success-whatsapp");

if (orderSuccess) {

    successReference.textContent =
        orderReference;

    successPlan.textContent =
        plan;

    successPrice.textContent =
        `₦${price.toLocaleString()}`;

    if (successWhatsApp) {

        const whatsappMessage =
            `Hello CVPro Nigeria, I just submitted a CV request. My order reference is ${orderReference}.`;

        successWhatsApp.href =
            `https://wa.me/2348044826710?text=${encodeURIComponent(whatsappMessage)}`;
    }

    orderSuccess.style.display =
        "block";
}

        } catch (error) {

            console.error(
                "Order submission error:",
                error
            );

            formMessage.textContent =
                "Something went wrong. Please try again.";

            formMessage.style.color =
                "#d62828";


        } finally {

            submitButton.disabled = false;

            submitButton.textContent =
                "Submit My CV Request";

        }

    });

}
// ========================================
// ADMIN DASHBOARD
// ========================================

const ordersContainer =
    document.getElementById("orders-container");

if (ordersContainer) {

    let allOrders = [];

    async function loadDashboard() {

        try {

            // Check logged-in user

            const {
                data: {
                    user
                }
            } = await supabaseClient.auth.getUser();


            if (!user) {

                window.location.href =
                    "login.html";

                return;
            }


            // Get orders

            const {
                data: orders,
                error
            } = await supabaseClient
                .from("orders")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


            if (error) {
                throw error;
            }


            // Statistics

            allOrders = orders;

            const total =
                orders.length;

            const pending =
                orders.filter(
                    order =>
                        order.status === "pending"
                ).length;

            const progress =
                orders.filter(
                    order =>
                        order.status === "in_progress"
                ).length;

            const completed =
                orders.filter(
                    order =>
                        order.status === "completed"
                ).length;


            document.getElementById(
                "total-orders"
            ).textContent = total;

            document.getElementById(
                "pending-orders"
            ).textContent = pending;

            document.getElementById(
                "progress-orders"
            ).textContent = progress;

            document.getElementById(
                "completed-orders"
            ).textContent = completed;


            // No orders

            if (orders.length === 0) {

                ordersContainer.innerHTML = `
                    <p class="loading">
                        No orders yet.
                    </p>
                `;

                return;
            }


            // Display orders

            ordersContainer.innerHTML =
                orders.map(order => {

                    const date =
                        new Date(
                            order.created_at
                        ).toLocaleString();


                    return `

                        <div class="order-card">

                            <div class="order-card-top">

                                <div>

                                    <h3>
                                        ${escapeHTML(
                                            order.full_name
                                        )}
                                    </h3>
                                
                                    <p class="order-reference">
                                    Order:
                                    ${escapeHTML(order.order_reference || "No reference")}
                                    </p>

                                    <p class="order-email">
                                        ${escapeHTML(
                                            order.email
                                        )}
                                    </p>

                                </div>

                                <span class="order-plan">
                                    ${escapeHTML(
                                        order.plan
                                    )}
                                </span>

                            </div>


                            <div class="order-details">

                                <div class="order-detail">

                                    <strong>
                                        PHONE
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            order.phone
                                        )}
                                    </span>

                                </div>


                                <div class="order-detail">

                                    <strong>
                                        LOCATION
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            order.location
                                        )}
                                    </span>

                                </div>


                                <div class="order-detail">

                                    <strong>
                                        EDUCATION
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            order.education
                                        )}
                                    </span>

                                </div>


                                <div class="order-detail">

                                    <strong>
                                        SKILLS
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            order.skills
                                        )}
                                    </span>

                                </div>


                                <div class="order-detail">

                                    <strong>
                                        EXPERIENCE
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            order.experience ||
                                            "Not provided"
                                        )}
                                    </span>

                                </div>


                                <div class="order-detail">

                                    <strong>
                                        ADDITIONAL INFORMATION
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            order.additional ||
                                            "None"
                                        )}
                                    </span>

                                </div>

                            </div>

                            <div class="order-actions">

    <a
        href="https://wa.me/${String(order.phone).replace(/\D/g, '')}"
        target="_blank"
        class="whatsapp-button"
    >
        WhatsApp Customer
    </a>

    <a
        href="cv-builder.html?order=${encodeURIComponent(order.id)}"
        class="cv-builder-button"
    >
        Create CV
    </a>

</div>


                            <div class="order-status">

                                <strong>
                                    Status:
                                </strong>

                                <select
                                    class="status-select"
                                    data-order-id="${order.id}"
                                >

                                    <option
                                        value="pending"
                                        ${order.status === "pending"
                                            ? "selected"
                                            : ""}
                                    >
                                        Pending
                                    </option>

                                    <option
                                        value="in_progress"
                                        ${order.status === "in_progress"
                                            ? "selected"
                                            : ""}
                                    >
                                        In Progress
                                    </option>

                                    <option
                                        value="completed"
                                        ${order.status === "completed"
                                            ? "selected"
                                            : ""}
                                    >
                                        Completed
                                    </option>

                                </select>

                            </div>


                            <small>
                                Submitted:
                                ${date}
                            </small>

                        </div>

                    `;

                }).join("");


            // Status changes

            document
                .querySelectorAll(".status-select")
                .forEach(select => {

                    select.addEventListener(
                        "change",
                        async function () {

                            const orderId =
                                this.dataset.orderId;

                            const newStatus =
                                this.value;


                            const {
                                error
                            } = await supabaseClient
                                .from("orders")
                                .update({
                                    status:
                                        newStatus
                                })
                                .eq(
                                    "id",
                                    orderId
                                );


                            if (error) {

                                console.error(
                                    error
                                );

                                alert(
                                    "Could not update order."
                                );

                                return;
                            }


                            loadDashboard();

                        }
                    );

                });


        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );

            ordersContainer.innerHTML = `
                <p class="loading">
                    Unable to load orders.
                </p>
            `;

        }

    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    loadDashboard();

}
// ========================================
// ADMIN LOGIN
// ========================================

const adminLoginForm =
    document.getElementById("admin-login-form");

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                document
                    .getElementById("admin-email")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("admin-password")
                    .value;

            const loginButton =
                adminLoginForm.querySelector(
                    "button[type='submit']"
                );

            loginButton.disabled = true;
            loginButton.textContent = "Logging in...";

            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth.signInWithPassword({
                        email: email,
                        password: password
                    });

                if (error) {
                    throw error;
                }

                if (!data.user) {
                    throw new Error("Login failed.");
                }

                // Login successful
                window.location.href =
                    "dashboard.html";

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                alert(
                    error.message ||
                    "Login failed. Please check your email and password."
                );

                loginButton.disabled = false;
                loginButton.textContent = "Login";

            }

        }
    );

}
// ========================================
// ADMIN LOGOUT
// ========================================

const logoutButton =
    document.getElementById("logout-button");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            const confirmLogout =
                confirm("Are you sure you want to log out?");

            if (!confirmLogout) {
                return;
            }

            const { error } =
                await supabaseClient.auth.signOut();

            if (error) {

                console.error(
                    "Logout error:",
                    error
                );

                alert(
                    "Could not log out. Please try again."
                );

                return;
            }

            window.location.href =
                "login.html";

        }
    );

}
// ========================================
// ORDER SEARCH
// ========================================

const orderSearch =
    document.getElementById("order-search");

if (orderSearch) {

    orderSearch.addEventListener(
        "input",
        function () {

            const searchTerm =
                this.value
                    .toLowerCase()
                    .trim();

            const orderCards =
                document.querySelectorAll(".order-card");

            orderCards.forEach(card => {

                const cardText =
                    card.textContent.toLowerCase();

                if (
                    cardText.includes(searchTerm)
                ) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }

            });

        }
    );

}


// ========================================
// REFRESH ORDERS
// ========================================

const refreshOrders =
    document.getElementById("refresh-orders");

if (refreshOrders) {

    refreshOrders.addEventListener(
        "click",
        async function () {

            refreshOrders.disabled = true;
            refreshOrders.textContent =
                "Refreshing...";

            await loadDashboard();

            refreshOrders.disabled = false;
            refreshOrders.textContent =
                "Refresh";

        }
    );

}
console.log("CVPro app.js loaded");
console.log("Order form:", document.getElementById("order-form"));


// ========================================
// ORDER TRACKING
// ========================================

const trackButton =
    document.getElementById("track-button");

if (trackButton) {

    async function trackOrder(reference) {

        const trackMessage =
            document.getElementById("track-message");

        const trackingResult =
            document.getElementById("tracking-result");

        trackMessage.textContent = "";
        trackingResult.style.display = "none";

        if (!reference) {
            trackMessage.textContent =
                "Please enter your order reference.";
            trackMessage.style.color = "#d62828";
            return;
        }

        trackButton.disabled = true;
        trackButton.textContent = "Checking...";

        try {

            const {
                data,
                error
            } = await supabaseClient
                .rpc("track_order", {
                    reference: reference
                });

            if (error) {
                throw error;
            }

            const order =
                data && data.length > 0
                    ? data[0]
                    : null;

            if (!order) {

                trackMessage.textContent =
                    "We couldn't find an order with that reference.";

                trackMessage.style.color =
                    "#d62828";

                return;
            }


            // ================================
            // DISPLAY ORDER DETAILS
            // ================================

            document.getElementById(
                "result-reference"
            ).textContent =
                order.order_reference;


            document.getElementById(
                "result-plan"
            ).textContent =
                order.plan;


            document.getElementById(
                "result-status"
            ).textContent =
                order.status;


            const statusTitle =
                document.getElementById(
                    "tracking-status"
                );

            const statusDescription =
                document.getElementById(
                    "tracking-description"
                );

            const statusIcon =
                document.getElementById(
                    "status-icon"
                );


            // ================================
            // STATUS MESSAGES
            // ================================

            if (order.status === "pending") {

                statusTitle.textContent =
                    "Pending";

                statusDescription.textContent =
                    "Your order has been received and is waiting to be processed.";

                statusIcon.textContent =
                    "1";

            }

            else if (order.status === "in_progress") {

                statusTitle.textContent =
                    "In Progress";

                statusDescription.textContent =
                    "We're currently working on your CV.";

                statusIcon.textContent =
                    "2";

            }

            else if (order.status === "completed") {

                statusTitle.textContent =
                    "Completed";

                statusDescription.textContent =
                    "Your CV has been completed.";

                statusIcon.textContent =
                    "✓";

            }

            else {

                statusTitle.textContent =
                    order.status;

                statusDescription.textContent =
                    "Your order status has been updated.";

                statusIcon.textContent =
                    "•";

            }


            trackingResult.style.display =
                "block";


        } catch (error) {

            console.error(
                "Order tracking error:",
                error
            );

            trackMessage.textContent =
                "Something went wrong. Please try again.";

            trackMessage.style.color =
                "#d62828";

        } finally {

            trackButton.disabled = false;

            trackButton.textContent =
                "Track My Order";

        }
    }


    // ========================================
    // MANUAL TRACKING
    // ========================================

    trackButton.addEventListener(
        "click",
        async function () {

            const referenceInput =
                document.getElementById(
                    "order-reference"
                );

            const reference =
                referenceInput.value
                    .trim()
                    .toUpperCase();

            await trackOrder(reference);

        }
    );


    // ========================================
    // AUTO TRACKING FROM URL
    // ========================================

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const urlReference =
        urlParams.get("reference");


    if (urlReference) {

        const referenceInput =
            document.getElementById(
                "order-reference"
            );

        referenceInput.value =
            urlReference.toUpperCase();

        trackOrder(
            urlReference.toUpperCase()
        );

    }

}
// ========================================
// CUSTOMER SIGNUP
// ========================================

const signupForm =
    document.getElementById("signup-form");

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document.getElementById(
                    "signup-name"
                ).value.trim();

            const email =
                document.getElementById(
                    "signup-email"
                ).value.trim();

            const password =
                document.getElementById(
                    "signup-password"
                ).value;

            const confirmPassword =
                document.getElementById(
                    "signup-password-confirm"
                ).value;

            const message =
                document.getElementById(
                    "signup-message"
                );

            const button =
                signupForm.querySelector(
                    "button[type='submit']"
                );

            message.textContent = "";
            message.style.color = "";

            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                message.style.color =
                    "#d62828";

                return;
            }

            button.disabled = true;
            button.textContent =
                "Creating Account...";

            try {

                const {
                    data,
                    error
                } = await supabaseClient.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: name
                        }
                    }
                });

                if (error) {
                    throw error;
                }

                message.textContent =
                    "Account created successfully! You can now log in.";

                message.style.color =
                    "#16803c";

                signupForm.reset();

                setTimeout(function () {

                    window.location.href =
                        "login.html";

                }, 1500);

            } catch (error) {

                console.error(
                    "Signup error:",
                    error
                );

                message.textContent =
                    error.message ||
                    "Unable to create your account.";

                message.style.color =
                    "#d62828";

            } finally {

                button.disabled = false;
                button.textContent =
                    "Create Account";
            }
        }
    );
}
// ========================================
// CUSTOMER LOGIN
// ========================================

const loginForm =
    document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                document.getElementById(
                    "login-email"
                ).value.trim();

            const password =
                document.getElementById(
                    "login-password"
                ).value;

            const message =
                document.getElementById(
                    "login-message"
                );

            const button =
                loginForm.querySelector(
                    "button[type='submit']"
                );

            message.textContent = "";
            message.style.color = "";

            button.disabled = true;
            button.textContent =
                "Logging in...";

            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth
                        .signInWithPassword({
                            email: email,
                            password: password
                        });

                if (error) {
                    throw error;
                }

                message.textContent =
                    "Login successful!";

                message.style.color =
                    "#16803c";

                setTimeout(function () {

                    window.location.href =
                        "customer-dashboard.html";

                }, 800);

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                message.textContent =
                    "Invalid email or password.";

                message.style.color =
                    "#d62828";

            } finally {

                button.disabled = false;
                button.textContent =
                    "Login";
            }
        }
    );
}
// ========================================
// CUSTOMER DASHBOARD
// ========================================

const customerOrdersContainer =
    document.getElementById(
        "customer-orders-container"
    );

if (customerOrdersContainer) {

    async function loadCustomerDashboard() {

        try {

            const {
                data: {
                    user
                },
                error: authError
            } = await supabaseClient.auth.getUser();

            if (authError || !user) {

                window.location.href =
                    "login.html";

                return;
            }

            const welcome =
                document.getElementById(
                    "customer-welcome"
                );

            if (welcome) {

                const customerName =
                    user.user_metadata?.full_name ||
                    user.email;

                welcome.textContent =
                    `Welcome back, ${customerName}.`;
            }


            const {
                data: orders,
                error
            } = await supabaseClient
                .from("orders")
                .select(
                    "order_reference, plan, status, created_at"
                )
                .eq(
                    "user_id",
                    user.id
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );

            if (error) {
                throw error;
            }


            if (!orders || orders.length === 0) {

                customerOrdersContainer.innerHTML = `
                    <div class="customer-empty">
                        <h3>No orders yet</h3>
                        <p>
                            You haven't submitted a CV request yet.
                        </p>
                        <a
                            href="order.html"
                            class="submit-button"
                        >
                            Create Your First Order
                        </a>
                    </div>
                `;

                return;
            }


            customerOrdersContainer.innerHTML =
                orders.map(function (order) {

                    let statusText =
                        order.status;

                    if (
                        order.status ===
                        "in_progress"
                    ) {
                        statusText =
                            "In Progress";
                    }

                    if (
                        order.status ===
                        "pending"
                    ) {
                        statusText =
                            "Pending";
                    }

                    if (
                        order.status ===
                        "completed"
                    ) {
                        statusText =
                            "Completed";
                    }

                    const date =
                        new Date(
                            order.created_at
                        ).toLocaleDateString(
                            "en-NG",
                            {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            }
                        );

                    let statusClass = "status-pending";

if (order.status === "in_progress") {
    statusClass = "status-progress";
}

if (order.status === "completed") {
    statusClass = "status-completed";
}

return `
    <div class="customer-order-card">

        <div class="customer-order-main">

            <div class="customer-order-icon">
                📄
            </div>

            <div>

                <span>Order Reference</span>

                <strong>
                    ${order.order_reference}
                </strong>

            </div>

        </div>


        <div class="customer-order-info">

            <span>Package</span>

            <strong>
                ${order.plan}
            </strong>

        </div>


        <div class="customer-order-info">

            <span>Submitted</span>

            <strong>
                ${date}
            </strong>

        </div>


        <div class="customer-order-status">

            <span>Status</span>

            <strong class="${statusClass}">
                ${statusText}
            </strong>

        </div>


        <div class="customer-order-action">

            <a
                href="track-order.html?reference=${encodeURIComponent(order.order_reference)}"
                class="view-order-button"
            >
                View Order
            </a>

        </div>

    </div>
`;

                }).join("");


        } catch (error) {

            console.error(
                "Customer dashboard error:",
                error
            );

            customerOrdersContainer.innerHTML = `
                <p class="customer-error">
                    Unable to load your orders.
                    Please refresh the page.
                </p>
            `;
        }
    }


    loadCustomerDashboard();
    loadCustomerCVs();
}

// ========================================
// LOAD CUSTOMER CVS
// ========================================

async function loadCustomerCVs() {

    const container =
        document.getElementById(
            "customer-cv-container"
        );

    if (!container) {
        return;
    }

    try {

        const {
            data: {
                user
            },
            error: authError
        } =
            await supabaseClient.auth.getUser();


        if (authError || !user) {

            window.location.href =
                "login.html";

            return;
        }


        const {
            data: cvs,
            error: cvError
        } = await supabaseClient

            .from("cv_documents")

            .select(`
                *,
                orders (
                    plan,
                    order_reference,
                    status
                )
            `)

            .eq(
                "user_id",
                user.id
            )

            .order(
                "updated_at",
                {
                    ascending: false
                }
            );


        if (cvError) {

            console.error(
                "CV loading error:",
                cvError
            );

            container.innerHTML = `
                <p class="customer-loading">
                    Unable to load your CV.
                </p>
            `;

            return;
        }


        if (!cvs || cvs.length === 0) {

            container.innerHTML = `
                <div class="customer-empty">

                    <h3>
                        No CV yet
                    </h3>

                    <p>
                        Your completed CV will appear here
                        once it has been created.
                    </p>

                    <a
                        href="order.html"
                        class="submit-button"
                    >
                        Create a CV
                    </a>

                </div>
            `;

            return;
        }


        container.innerHTML = cvs.map(function (cv) {

            const plan =
                cv.orders?.plan ||
                "CV Service";

            const reference =
                cv.orders?.order_reference ||
                "N/A";

            const updatedDate =
                cv.updated_at
                    ? new Date(
                        cv.updated_at
                    ).toLocaleDateString()
                    : "N/A";


            return `

                <div class="customer-cv-card">

                    <div class="customer-cv-info">

                        <h3>
                            ${cv.professional_title || "Professional CV"}
                        </h3>

                        <p>
                            <strong>
                                Plan:
                            </strong>
                            ${plan}
                        </p>

                        <p>
                            <strong>
                                Order:
                            </strong>
                            ${reference}
                        </p>

                        <p>
                            <strong>
                                Last updated:
                            </strong>
                            ${updatedDate}
                        </p>

                    </div>


                    <div class="customer-cv-actions">

                        <a
                            href="cv-builder.html?order=${encodeURIComponent(
                                cv.order_id
                            )}"
                            class="submit-button"
                        >
                            Edit CV
                        </a>

                    </div>

                </div>

            `;

        }).join("");


    } catch (error) {

        console.error(
            "Customer CV error:",
            error
        );

        container.innerHTML = `
            <p class="customer-loading">
                Something went wrong while loading your CV.
            </p>
        `;
    }
}
// ========================================
// CUSTOMER LOGOUT
// ========================================

const customerLogout =
    document.getElementById("customer-logout");

if (customerLogout) {
    customerLogout.addEventListener(
        "click",
        async function () {

            const confirmLogout = confirm(
                "Are you sure you want to log out?"
            );

            if (!confirmLogout) {
                return;
            }

            customerLogout.disabled = true;
            customerLogout.textContent = "Logging out...";

            try {
                const { error } =
                    await supabaseClient.auth.signOut();

                if (error) {
                    throw error;
                }

                window.location.href = "login.html";

            } catch (error) {
                console.error(
                    "Customer logout error:",
                    error
                );

                alert(
                    "Unable to log out. Please try again."
                );

                customerLogout.disabled = false;
                customerLogout.textContent = "Logout";
            }
        }
    );
}
// ========================================
// AUTO-SELECT CV PACKAGE
// ========================================

const planSelect =
    document.getElementById("plan");

if (planSelect) {

    const urlParams =
        new URLSearchParams(window.location.search);

    const selectedPlan =
        urlParams.get("plan");

    if (selectedPlan === "basic") {
        planSelect.value = "Basic CV";
    }

    if (selectedPlan === "professional") {
        planSelect.value = "Professional CV";
    }

    if (selectedPlan === "career") {
        planSelect.value = "Career Package";
    }
}