document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
    const images = document.querySelectorAll(".draggable");
    const placedImages = [];


    // Prevent images from being dragged as files
    images.forEach((image) => {
        image.addEventListener("dragstart", (e) => {
            e.preventDefault();
        });
    });


    // Random Position
    function getRandomPosition(image) {
        let containerRect = container.getBoundingClientRect();
        let imgWidth = image.clientWidth;
        let imgHeight = image.clientHeight;


        let padding = 20; // Space of the images
        let maxAttempts = 100;
        let attempts = 0;
        let x, y, isValidPosition;


        let minDistance = 200; // Minimum distance between images


        do {
            // images staying inside the container
            x = Math.random() * (containerRect.width - imgWidth - padding * 2) + padding;
            y = Math.random() * (containerRect.height - imgHeight - padding * 2) + padding;


            // Check if the new position is far enough from all other placed images
            isValidPosition = placedImages.every(otherImage => {
                let otherRect = otherImage.getBoundingClientRect();
                let dx = x - otherRect.left;
                let dy = y - otherRect.top;
                let distance = Math.sqrt(dx * dx + dy * dy); // Calculate Euclidean distance between images


                return distance >= minDistance; // Ensure the distance is greater than or equal to minDistance
            });


            attempts++;
        } while (!isValidPosition && attempts < maxAttempts);


        return { x, y };
    }


    function applyFadeInEffect(image) {
        let delay = Math.random() * 1.5;
        image.style.animation = `fadeIn 2s ${delay}s forwards`;
    }


    // Image stays in position after dragging
    function enableDragging(image) {
        image.addEventListener("mousedown", (e) => {
            let offsetX = e.clientX - image.getBoundingClientRect().left;
            let offsetY = e.clientY - image.getBoundingClientRect().top;
            document.body.style.userSelect = "none";
           
            // Disable transition during dragging
            image.style.transition = "none";  


            function onMouseMove(e) {
                let newX = e.clientX - offsetX - container.getBoundingClientRect().left;
                let newY = e.clientY - offsetY - container.getBoundingClientRect().top;


                newX = Math.max(0, Math.min(newX, container.clientWidth - image.clientWidth));
                newY = Math.max(0, Math.min(newY, container.clientHeight - image.clientHeight));


                // Apply smooth translate using transform and allow smooth transition during drag
                image.style.position = "absolute"; // Position absolutely to move with the cursor
                image.style.left = `${newX}px`;
                image.style.top = `${newY}px`;
                image.style.transition = "left 0.1s ease-out, top 0.1s ease-out"; // Add smooth transition during drag
            }


            function onMouseUp() {
                // Apply a smooth transition after dragging ends
                image.style.transition = "left 0.3s ease-out, top 0.3s ease-out"; // Smooth transition for left/top
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
                document.body.style.userSelect = "auto";
            }


            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });
    }


    // Enhanced cursor style (Option 2)
    function addCursorEffect(image) {
        image.style.cursor = "grab"; // Change cursor to grab when hovering over image


        image.addEventListener("mousedown", () => {
            image.style.cursor = "grabbing"; // Change cursor to grabbing when image is being dragged
        });


        image.addEventListener("mouseup", () => {
            image.style.cursor = "grab"; // Change back to grab cursor when dragging stops
        });
    }


    // Add hover effect to scale the image
    function addHoverEffect(image) {
        image.addEventListener("mouseenter", () => {
            image.style.transform = "scale(1.05)"; // Scale up the image on hover
            image.style.transition = "transform 0.3s ease"; // Smooth transition
        });


        image.addEventListener("mouseleave", () => {
            image.style.transform = "scale(1)"; // Reset to original size
        });
    }


    images.forEach((image) => {
        const { x, y } = getRandomPosition(image);
        image.style.left = `${x}px`;
        image.style.top = `${y}px`;
        placedImages.push(image);


        applyFadeInEffect(image);
        enableDragging(image);
        addCursorEffect(image); // Apply the enhanced cursor effect
        addHoverEffect(image); // Apply the hover effect for scaling
    });
});