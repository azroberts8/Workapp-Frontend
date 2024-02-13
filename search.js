let location1 = "Newark, DE"
let rating = "★★★★★"
let position = "Software Engineer"
let company = "Sparks Lab"
//let description = "Boring ahh job ... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a convallis tellus, nec vulputate mi. Duis nec lorem ante. Cras et metus nec arcu iaculis accumsan non vitae justo. Fusce at erat iaculis, porttitor urna quis, consequat purus. Suspendisse at tellus a arcu sodales placerat. Phasellus at ex tincidunt purus maximus varius quis vel purus."
//let restrictions = ["16+ age", "35+yrs experience", "Typescript", "AngularJS","Magical Powers", "All-Knowing"]
//let compensation = "80-100k yr"
let jobType = "Internship"
let img = "https://picsum.photos/200/100/?random=" + Math.round(Math.random() * 1000000) + ")"

class Carousel {

    constructor(element) {

        this.board = element

        // add first two cards programmatically
        this.push()
        //this.push()

        // handle gestures
        this.handle()

    }

    handle() {

        // list all cards
        this.cards = this.board.querySelectorAll('.card')

        // get top card
        this.topCard = this.cards[this.cards.length - 1]

        // get next card
        this.nextCard = this.cards[this.cards.length - 2]

        // if at least one card is present
        if (this.cards.length > 0) {

            // set default top card position and scale
            this.topCard.style.transform = 'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(1)'

            // destroy previous Hammer instance, if present
            if (this.hammer) this.hammer.destroy()

            // listen for tap and pan gestures on top card
            this.hammer = new Hammer(this.topCard)
            this.hammer.add(new Hammer.Tap())
            this.hammer.add(new Hammer.Pan({
                position: Hammer.position_ALL,
                threshold: 0
            }))

            // pass events data to custom callbacks
            this.hammer.on('tap', (e) => {
                this.onTap(e)
            })
            this.hammer.on('pan', (e) => {
                this.onPan(e)
            })

        }

    }

    onTap(e) {

        // get finger position on top card
        let propX = (e.center.x - e.target.getBoundingClientRect().left) / e.target.clientWidth

        // get rotation degrees around Y axis (+/- 15) based on finger position
        let rotateY = 15 * (propX < 0.05 ? -1 : 1)

        // enable transform transition
        this.topCard.style.transition = 'transform 100ms ease-out'

        // apply rotation around Y axis
        this.topCard.style.transform =
            'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(' + rotateY + 'deg) scale(1)'

        // wait for transition end
        setTimeout(() => {
            // reset transform properties
            this.topCard.style.transform =
                'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(1)'
        }, 100)

    }

    onPan(e) {

        if (!this.isPanning) {

            this.isPanning = true

            // remove transition properties
            this.topCard.style.transition = null
            if (this.nextCard) this.nextCard.style.transition = null

            // get top card coordinates in pixels
            let style = window.getComputedStyle(this.topCard)
            let mx = style.transform.match(/^matrix\((.+)\)$/)
            this.startPosX = mx ? parseFloat(mx[1].split(', ')[4]) : 0
            this.startPosY = mx ? parseFloat(mx[1].split(', ')[5]) : 0

            // get top card bounds
            let bounds = this.topCard.getBoundingClientRect()

            // get finger position on top card, top (1) or bottom (-1)
            this.isDraggingFrom =
                (e.center.y - bounds.top) > this.topCard.clientHeight / 2 ? -1 : 1

        }

        // get new coordinates
        let posX = e.deltaX + this.startPosX
        let posY = e.deltaY + this.startPosY

        // get ratio between swiped pixels and the axes
        let propX = e.deltaX / this.board.clientWidth
        let propY = e.deltaY / this.board.clientHeight

        // get swipe direction, left (-1) or right (1)
        let dirX = e.deltaX < 0 ? -1 : 1

        // get degrees of rotation, between 0 and +/- 45
        let deg = this.isDraggingFrom * dirX * Math.abs(propX) * 45

        // get scale ratio, between .95 and 1
        let scale = (95 + (5 * Math.abs(propX))) / 100

        // move and rotate top card
        this.topCard.style.transform =
            'translateX(' + posX + 'px) translateY(' + posY + 'px) rotate(' + deg + 'deg) rotateY(0deg) scale(1)'

        // scale up next card
        if (this.nextCard) this.nextCard.style.transform =
            'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(' + scale + ')'

        if (e.isFinal) {

            this.isPanning = false

            let successful = false

            // set back transition properties
            this.topCard.style.transition = 'transform 200ms ease-out'
            if (this.nextCard) this.nextCard.style.transition = 'transform 100ms linear'

            // check threshold and movement direction
            if (propX > 0.25 && e.direction == Hammer.DIRECTION_RIGHT) {

                successful = true
                // get right border position
                posX = this.board.clientWidth

            } else if (propX < -0.25 && e.direction == Hammer.DIRECTION_LEFT) {

                successful = true
                // get left border position
                posX = -(this.board.clientWidth + this.topCard.clientWidth)

            } else if (propY < -0.25 && e.direction == Hammer.DIRECTION_UP) {

                successful = true
                // get top border position
                posY = -(this.board.clientHeight + this.topCard.clientHeight)

            }

            if (successful) {

                // throw card in the chosen direction
                this.topCard.style.transform =
                    'translateX(' + posX + 'px) translateY(' + posY + 'px) rotate(' + deg + 'deg)'

                // wait transition end
                setTimeout(() => {
                    // remove swiped card
                    this.board.removeChild(this.topCard)
                    // add new card
                    this.push()
                    // handle gestures on new top card
                    this.handle()
                }, 200)

            } else {

                // reset cards position and size
                this.topCard.style.transform =
                    'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(1)'
                if (this.nextCard) this.nextCard.style.transform =
                    'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(0.95)'

            }

        }

    }

    push() {
        //Title, Description, Organization, Restrictions (grade level/age), Compensation
        //Here we would probably make an API call to the 

        let card = document.createElement('div')
        let cardInformation = document.createElement('div')

        const star_half = "<a style='font-size: 14px; padding-top: 4px;' class='material-symbols-outlined'>star_half</a>"
        const star_empty = "<a style='font-size: 14px; padding-top: 4px;' class='material-symbols-outlined'>star</a>"
        const star = "★"
        
        let location = "Newark, DE"
        let rating = "2.5"
        let position = "Software Engineer"
        let company = "Sparks Lab"
        let description = "Boring ahh job ... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a convallis tellus, nec vulputate mi. Duis nec lorem ante. Cras et metus nec arcu iaculis accumsan non vitae justo. Fusce at erat iaculis, porttitor urna quis, consequat purus. Suspendisse at tellus a arcu sodales placerat. Phasellus at ex tincidunt purus maximus varius quis vel purus."
        let restrictions = ["16+ age", "35+yrs experience", "Typescript", "AngularJS","Magical Powers", "All-Knowing"]
        let compensation = "80-100k yr"
        let jobType = "Internship"

        /*let cardTitle = document.createElement('p')
        let cardDesc = document.createElement('p')
        let cardOrg = document.createElement('p')
        let cardRestrict = document.createElement('p')
        let cardCompensation = document.createElement('p')

        cardTitle.innerText = 'Software Engineer'
        cardDesc.innerText = 'Free labor plz'
        cardOrg.innerText = 'Fart Company'
        cardRestrict.innerText = 'ages 16+'
        cardCompensation.innerText = '$100,000 yr'

        cardInformation.appendChild(cardTitle)
        cardInformation.appendChild(cardDesc)
        cardInformation.appendChild(cardOrg)
        cardInformation.appendChild(cardRestrict)
        cardInformation.appendChild(cardCompensation)*/

        cardInformation.innerHTML = 
        `<div style="grid-column: 1; width: 100%; margin: 2%;">
            <!--<img class="circular-image" src="https://imgs.search.brave.com/YKRz1oWwVqt0zhQ-ejSzyjgRhY7saCMVGGyE0QU63Gw/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8xMC8wNi9y/b3VuZC1hcnJvdy1i/dXNpbmVzcy1sb2dv/LXZlY3Rvci0xNDYz/MTAwNi5qcGc">-->
            <img class="circular-image" src="https://picsum.photos/200/200/?random=${Math.round(Math.random() * 1000000)}">
        </div>
        <div style="grid-column: 2; width: 100%">
            <p id="responsive-position" style='margin: 1%; font-size: 26px;'>${position}</p>
            <p style='margin: 1%;'>${jobType}, ${company}</p>
            <p style='margin: 1%;'>${location}</p>
        </div>
        <div style="grid-column: 3;">
            <span id="rating" style="display: inline-flex;"></span>
            <p style='margin: 1%;'>${compensation}</p>
        </div>`

        for(const item of restrictions){
            $("#restrictions").append(`<span style='margin: 1%;' class="badge badge-pill badge-dark">${item}</span>`)
        }
        var ratingHTML = "";
        for(var i=0 ; i<parseInt(rating); i++){ ratingHTML+=star;}
        if(Number(rating)-parseInt(rating)){ratingHTML+=star_half;}
        for(var i=0 ; i<(4-parseInt(rating)); i++){ratingHTML+=star_empty;}
        $("#rating").html(ratingHTML)
        

        //TODO fix this #rating to have the unique card ID maybe or just get the element and add it probably

        //card.appendChild(cardImage)
        card.appendChild(cardInformation)
    



        card.classList.add('card')
        cardInformation.classList.add('cardInformation')
        
        //cardImage.style.backgroundImage = "url('https://picsum.photos/400/100/?random=" + Math.round(Math.random() * 1000000) + "')"
        //cardImage.src = "https://picsum.photos/400/200/?random=" + Math.round(Math.random() * 1000000) + ")"

        this.board.insertBefore(card, this.board.firstChild)

    }

}

for(var i; i < 2; i++){
    $("#tbody").append(`<tr style='width: 100vw; height: 15vh; position: relative;'></tr><tr style='width: 100vw; height: 15vh; position: relative;'></tr>`)
}
$("#tbody").append(`<tr style='width: 100vw; height: 15vh; position: relative;'></tr><tr style='width: 100vw; height: 15vh; position: relative;'></tr><tr style='width: 100vw; height: 15vh; position: relative;'></tr><tr style='width: 100vw; height: 15vh; position: relative;'></tr><tr style='width: 100vw; height: 15vh; position: relative;'></tr><tr style='width: 100vw; height: 15vh; position: relative;'></tr><tr style='width: 100vw; height: 15vh; position: relative;'></tr><tr style='width: 100vw; height: 15vh; position: relative;'></tr><tr style='width: 100vw; height: 15vh; position: relative;'></tr><tr style='width: 100vw; height: 15vh; position: relative;'></tr>`)

//let tr = document.querySelector('#board')
let tr = document.getElementsByTagName('tr')
for(const trElement of tr){
    let carousel = new Carousel(trElement);
}
//let carousel = new Carousel(tr);


