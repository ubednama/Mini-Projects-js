const circleCoor = [];

function checkIntersection() {
    const circle1 = circleCoor[0];
    const circle2 = circleCoor[1];

    const x1 = circle1.x
    const y1 = circle1.y
    const r1 = circle1.r
    
    const x2 = circle2.x
    const y2 = circle2.y
    const r2 = circle2.r

    return Math.hypot(x1-x2, y1-y2) <=r1+r2
}

document.addEventListener('click', (e)=> {
    
    const allCircles = document.querySelectorAll(".circle");
    const messageDiv = document.querySelector(".message")
    if(allCircles.length === 2){
        allCircles.forEach(circles => {
            document.body.removeChild(circles)
            circleCoor.shift();
            console.log(circleCoor)
        })
        if (messageDiv) {
            document.body.removeChild(messageDiv)
        }
    }

    const x = e.clientX
    const y = e.clientY

    // console.log(circleCoor)
    
    const randomRadius = Math.random() * 100;
    circleCoor.push({x,y, r:randomRadius})
    
    const circle = document.createElement('div');
    circle.classList.add('circle')
    circle.style.top = y-randomRadius + "px"
    circle.style.left = x-randomRadius + 'px'
    circle.style.width = randomRadius*2 + 'px'
    circle.style.height = randomRadius*2 + 'px'

    document.body.appendChild(circle)

    const message = document.createElement('div');
    message.classList.add('message')
    if(circleCoor.length == 2){
        const res = checkIntersection()
        message.innerHTML = `<b>Intersection is ${res}</b>`
        document.body.appendChild(message)
        console.log("Intersection is ",res)
    }

})