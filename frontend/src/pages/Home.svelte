<script>
    import {Line} from 'svelte-chartjs';

    import {
        CategoryScale,
        Chart as ChartJS,
        Legend,
        LinearScale,
        LineElement,
        PointElement,
        Title,
        Tooltip,
    } from 'chart.js';
    import axios from "axios";

    ChartJS.register(
        Title,
        Tooltip,
        Legend,
        LineElement,
        LinearScale,
        PointElement,
        CategoryScale
    );

    let dataOfData = [];
    let labels = [];

    let data = {
        labels: labels,
        datasets: [
            {
                label: 'Teilnehmer über die Wettkämpfe',
                fill: true,
                lineTension: 0.3,
                backgroundColor: 'rgba(225, 204,230, .3)',
                borderColor: 'rgb(205, 130, 158)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgb(205, 130,1 58)',
                pointBackgroundColor: 'rgb(255, 255, 255)',
                pointBorderWidth: 10,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgb(0, 0, 0)',
                pointHoverBorderColor: 'rgba(220, 220, 220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: dataOfData,
            }
        ]
    }

    async function getCompData() {
        try {

            await axios.get("http://localhost:3001/api/comp").then((response) => {
                response = response.data;
                for (let i = 0; i < response.length; i++) {
                    dataOfData.push(response[i].amount)
                    labels.push(response[i].date)
                    data.datasets[0].data = dataOfData;
                    data.labels = labels;
                }
            });
        } catch (err) {
            console.log(err)
        }

    }

    getCompData();


</script>

<div id="carouselExampleCaptions" class="carousel slide">
    <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active"
                aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1"
                aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2"
                aria-label="Slide 3"></button>
    </div>
    <div class="carousel-inner">
        <div class="carousel-item active">
            <img src="https://pontonier.ch/cms/images/stories/website/headers/20220108_slider/0001.jpg"
                 class="d-block w-100" alt="...">
            <div class="carousel-caption d-none d-md-block">
                <h5>Wettkampf</h5>
                <p>So sehen Boote aus die für den Wettkampf bereit stehen</p>
            </div>
        </div>
        <div class="carousel-item">
            <img src="https://pontonier.ch/cms/images/stories/website/headers/20220108_slider/0002.jpg"
                 class="d-block w-100" alt="...">
            <div class="carousel-caption d-none d-md-block">
                <h5>Stachelfahrt</h5>
                <p>So sieht eine Stachelfahrt aus</p>
            </div>
        </div>
        <div class="carousel-item">
            <img src="https://pontonier.ch/cms/images/stories/website/headers/20220108_slider/0003.jpg"
                 class="d-block w-100" alt="...">
            <div class="carousel-caption d-none d-md-block">
                <h5>Sektionsfahrt</h5>
                <p>Eine Sektiosnüberfahrt des Vereins Bremgarten</p>
            </div>
        </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    </button>
</div>
<div>
    <Line {data} options={{ responsive: true }}/>
</div>

