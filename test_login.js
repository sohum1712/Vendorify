

async function testLogin() {
    try {
        console.log("Attempting login...");
        // Assuming there is a user. If not, we might need to register first.
        // I'll try to register a fresh verified vendor first to be sure.

        const timestamp = Date.now();
        const mobile = "9876543210"; // Use a fixed mobile for testing or random?
        // Let's use a random one to avoid conflict
        const randomMobile = "9" + Math.floor(Math.random() * 1000000000);

        console.log(`Registering vendor with mobile: ${randomMobile}`);
        const regRes = await fetch('http://127.0.0.1:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test Vendor",
                mobile: randomMobile,
                password: "password123",
                role: "vendor"
            })
        });

        const regData = await regRes.json();
        console.log("Registration Response:", regData);

        if (!regRes.ok) {
            console.error("Registration failed");
            return;
        }

        console.log("Login with same credentials...");
        const loginRes = await fetch('http://127.0.0.1:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mobile: randomMobile,
                password: "password123"
            })
        });

        const loginData = await loginRes.json();
        console.log("Login Response Status:", loginRes.status);
        console.log("Login Response Data:", loginData);

        if (loginData.role === 'vendor') {
            console.log("SUCCESS: Role is vendor.");
        } else {
            console.log(`FAILURE: Role is ${loginData.role}, expected 'vendor'.`);
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

testLogin();
