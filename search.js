let location1 = "Newark, DE"
let rating = "★★★★★"
let position = "Software Engineer"
let company = "Sparks Lab"
//let description = "Boring ahh job ... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a convallis tellus, nec vulputate mi. Duis nec lorem ante. Cras et metus nec arcu iaculis accumsan non vitae justo. Fusce at erat iaculis, porttitor urna quis, consequat purus. Suspendisse at tellus a arcu sodales placerat. Phasellus at ex tincidunt purus maximus varius quis vel purus."
//let restrictions = ["16+ age", "35+yrs experience", "Typescript", "AngularJS","Magical Powers", "All-Knowing"]
//let compensation = "80-100k yr"
let jobType = "Internship"
let img = "https://picsum.photos/200/100/?random=" + Math.round(Math.random() * 1000000) + ")"

$("#tbody").append(`
<tr>
    <td>
        <img src=${img}>
    </td>

    <td>
        <div>
            <a href="">${position}</a>
            <p>
                <a href="">${company}</a>
                <p>${rating}</p>
            </p>
        </div>
    </td>

    <td>
            <p>${jobType}</p>
            <p>${location1}</p>
    </td>

    <td>
            <a href="">
                <svg
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            </a>
    </td>
</tr>

`)


