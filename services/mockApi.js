export const analyzeImage = async (imageUri) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Randomly return YES, NO, or MODERATE
            const statuses = ['YES', 'NO', 'MODERATE'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

            let result = {
                status: randomStatus,
                ingredient: "Unknown",
                reason: "Analysis complete."
            };

            if (randomStatus === 'NO') {
                result.ingredient = "High Fructose Corn Syrup";
                result.reason = "High sugar content linked to health issues.";
            } else if (randomStatus === 'YES') {
                result.ingredient = "Natural Ingredients";
                result.reason = "Product appears safe for consumption.";
            } else {
                result.ingredient = "Preservatives (E202)";
                result.reason = "Safe in small quantities.";
            }

            resolve(result);
        }, 2000); // 2 second delay
    });
};

export const lookupProduct = async (barcodeData) => {
    try {
        console.log(`Fetching data for barcode: ${barcodeData}`);
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcodeData}.json`, {
            headers: {
                'User-Agent': 'FoodScannerApp/1.0 (expo-react-native) - Android'
            }
        });
        const data = await response.json();

        if (data.status === 1) {
            const product = data.product;

            // Map Nutri-Score to Status
            // a, b -> YES
            // c -> MODERATE
            // d, e -> NO
            // unknown -> MODERATE
            const grade = product.nutriscore_grade ? product.nutriscore_grade.toLowerCase() : 'unknown';
            let status = 'MODERATE';
            let reason = 'Nutritional data unavailable.';

            if (['a', 'b'].includes(grade)) {
                status = 'YES';
                reason = 'Good nutritional quality (Nutri-Score ' + grade.toUpperCase() + ').';
            } else if (grade === 'c') {
                status = 'MODERATE';
                reason = 'Moderate nutritional quality.';
            } else if (['d', 'e'].includes(grade)) {
                status = 'NO';
                reason = 'Poor nutritional quality (Nutri-Score ' + grade.toUpperCase() + ').';
            }

            // Extract Ingredients
            const ingredient = product.ingredients_text_en || product.ingredients_text || "Ingredients not found";

            // Extract Image
            const imageUri = product.image_url || product.image_front_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";

            return {
                status,
                ingredient: ingredient.length > 100 ? ingredient.substring(0, 100) + "..." : ingredient,
                reason,
                imageUri,
                productName: product.product_name || "Unknown Product"
            };
        } else {
            console.log("Product not found in Open Food Facts");
            return null; // Product not found
        }
    } catch (error) {
        console.error("API Lookup Error:", error);
        return null;
    }
};
