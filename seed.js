const mongoose   = require('mongoose'),
      Movie      = require('./models/movie'),
      Comment    = require('./models/comment'),
      User       = require('./models/user'),
      Cinemas    = require('./models/cinemas'),
      Seat       = require('./models/seat'),
      Showtime   = require('./models/showtime'),
      Theater    = require('./models/theater');

const Moviedata = [
    {
        name: "Aladdin",
        date: "20 February 2022",
        time: "128",
        status: "Now Showing",
        category: "none",
        image: "/assets/img/poster/aladdin.jpg",
        video: "/assets/video/Aladdin.mp4",
        synopsis: "A thrilling and vibrant live-action adaptation of Disney’ sanimated classic, “Aladdin” is the exciting tale of the charming street rat Aladdin, the courageous and self-determined Princess Jasmine and the Genie who may be the key to their future.",
        director: "Guy Ritchie",
    },

    {
        name: "The Batman",
        date: "30 March 2022",
        time: "178 min",
        status: "Now Showing",
        category: "none",
        image: "/assets/img/poster/Batman.jpg",
        video: "/assets/video/Batman.mp4",
        synopsis: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues. As the evidence begins to lead closer to home and the scale of the perpetrator's plans become clear, he must forge new relationships, unmask the culprit and bring justice to the abuse of power and corruption that has long plagued the metropolis.",
        director: "Matt Reeves",
    },

    {
        name: "Bohemian Rhapsody",
        date: "24 October 2022",
        time: "134",
        status: "Now Showing",
        category: "popular",
        image: "/assets/img/poster/bohe.jpg",
        video: "/assets/video/Bohe.mp4",
        synopsis: "Freddie Mercury -- the lead singer of Queen -- defies stereotypes and convention to become one of history's most beloved entertainers. The band's revolutionary sound and popular songs lead to Queen's meteoric rise in the 1970s. After leaving the group to pursue a solo career, Mercury reunites with Queen for the benefit concert Live Aid -- resulting in one of the greatest performances in rock 'n' roll history.",
        director: "Bryan Singer",
    },

    {
        name: "Captain Marvel",
        date: "27 February 2022",
        time: "124",
        status: "Now Showing",
        category: "popular",
        image: "/assets/img/poster/captain-marvel.jpg",
        video: "/assets/video/Captain Marvel.mp4",
        synopsis: "Captain Marvel is an extraterrestrial Kree warrior who finds herself caught in the middle of an intergalactic battle between her people and the Skrulls. Living on Earth in 1995, she keeps having recurring memories of another life as U.S. Air Force pilot Carol Danvers. With help from Nick Fury, Captain Marvel tries to uncover the secrets of her past while harnessing her special superpowers to end the war with the evil Skrulls.",
        director: "Anna Boden",
    },

    {
        name: "Doraemon",
        date: "31 March 2022",
        time: "95",
        status: "Now Showing",
        category: "none",
        image: "/assets/img/poster/Doraemon.jpg",
        video: "/assets/video/Doraemon.mp4",
        synopsis: "Nobita Nobi is a fifth grader who constantly gets failing grades in his subjects due to his laziness and is always bullied by his classmates Suneo Honekawa and Takeshi 'Gian' Goda.",
        director: "Takashi Yamazaki",
    },

    {
        name: "Dune",
        date: "22 April 2022",
        time: "155",
        status: "Now Showing",
        category: "none",
        image: "/assets/img/poster/dune.jpg",
        video: "/assets/video/Dune.mp4",
        synopsis: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people. As malevolent forces explode into conflict over the planet's exclusive supply of the most precious resource in existence, only those who can conquer their own fear will survive.",
        director: "Denis Villreneuve",
    },

    {
        name: "Encanto",
        date: "24 April 2022",
        time: "99",
        status: "Now Showing",
        category: "popular",
        image: "/assets/img/poster/encanto.jpg",
        video: "/assets/video/Encanto.mp4",
        synopsis: "The Madrigals are an extraordinary family who live hidden in the mountains of Colombia in a charmed place called the Encanto. The magic of the Encanto has blessed every child in the family with a unique gift -- every child except Mirabel. However, she soon may be the Madrigals last hope when she discovers that the magic surrounding the Encanto is now in danger.",
        director: "Jared Bush",
        director: "Byron Howard",
    },

    {
        name: "Avengers Endgame",
        date: "26 April 2022",
        time: "182",
        status: "Now Showing",
        category: "popular",
        image: "/assets/img/poster/endgame.jpg",
        video: "/assets/video/Endgame.mp4",
        synopsis: "After Thanos, an intergalactic warlord, disintegrates half of the universe, the Avengers must reunite and assemble again to reinvigorate their trounced allies and restore balance.",
        director: "Jared Bush",
    },

    {
        name: "Joker",
        date: "4 March 2022",
        time: "122",
        status: "Now Showing",
        category: "none",
        image: "/assets/img/poster/joker.jpg",
        video: "/assets/video/Joker.mp4",
        synopsis: "Arthur Fleck, a party clown, leads an impoverished life with his ailing mother. However, when society shuns him and brands him as a freak, he decides to embrace the life of crime and chaos.",
        director: "Tood Phillips",
    },

    {
        name: "Soul",
        date: "25 February 2022",
        time: "100",
        status: "Now Showing",
        category: "none",
        image: "/assets/img/poster/soul.jpg",
        video: "/assets/video/Soul.mp4",
        synopsis: "A jazz musician, stuck in a mediocre job, finally gets his big break. However, when a wrong step takes him to the Great Before, he tries to help an infant soul in order to return to reality.",
        director: "Pete Docter",
    },

    {
        name: "Us",
        date: "22 March 2022",
        time: "121",
        status: "Now Showing",
        category: "none",
        image: "/assets/img/poster/us.jpg",
        video: "/assets/video/Us.mp4",
        synopsis: "Adelaide Wilson and her family are attacked by mysterious figures dressed in red. Upon closer inspection, the Wilsons realise that the intruders are exact lookalikes of them.",
        director: "Jordan Peele", 
    },

    {
        name: "X-Men Apocalypse",
        date: "19 May 2022",
        time: "144",
        status: "Now Showing",
        category: "none",
        image: "/assets/img/poster/x-men.jpg",
        video: "/assets/video/X-Men.mp4",
        synopsis: "The all-powerful mutant Apocalypse, who is long revered as a god, wants to cause extinction on earth. The X-Men must work together to demolish his plans.",
        director: "Bryan Singer",
    },

    {
        name: "Downton Abbey",
        date: "29 October 2022",
        time: "125",
        status: "Coming Soon",
        category: "none",
        image: "/assets/img/poster/abbey.jpg",
        video: "/assets/video/Abbey.mp4",
        synopsis: "The Crawley family goes on a grand journey to the South of France to uncover the mystery of the dowager countess's newly inherited villa.",
        director: "Simon Curtis",
    },

    {
        name: "Interstellar",
        date: "6 November 2022",
        time: "169",
        status: "Coming Soon",
        category: "none",
        image: "/assets/img/poster/interstellar.jpg",
        video: "/assets/video/Interstellar.mp4",
        synopsis: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
        director: "Christopher Nolan",
    },
]

const Cinemadata = [
    {
        name: "MVP4D Ratchayothin",
        branch: "Bangkok: Northern",
    },
    {
        name: "MVPX Ratchadapisek",
        branch: "Bangkok: Northern",
    },
    {
        name: "MVP Eastville",
        branch: "Bangkok: Northern",
    },
    {
        name: "MVP4D Paradise",
        branch: "Bangkok: Eastern",   
    },
    {
        name: "MVPx Samrong",
        branch: "Bangkok: Eastern",
    },
    {
        name: "MVP Big C Samutprakan",
        branch: "Bangkok: Eastern",
    },
    {
        name: "MVP4D Gateway",
        branch: "Bangkok: Urban",
    },
    {
        name: "MVPx Paragon",
        branch: "Bangkok: Urban",
    },
    {
        name: "MVP MBK",
        branch: "Bangkok: Urban",
    },
    {
        name: "MVP4D Westgate",
        branch: "Bangkok: Nonthaburi",
    },
    {
        name: "MVPX Chaengwatthana",
        branch: "Bangkok: Nonthaburi",
    },
    {
        name: "MVP Lotus Bangyai",
        branch: "Bangkok: Nonthaburi",
    },
]

function seedDB(){
    Comment.remove({}, (err) => {
        if(err){
            console.log(err);
        } else {
            console.log('Comment remove complete');
        }
    });
    Cinemas.remove({}, (err) => {
        if(err){
            console.log(err);
        } else {
            console.log('Cinemas remove complete');
            Cinemas.create(Cinemadata, (err,item) => {
                if(err){
                    console.log(err);
                } else{
                    console.log('Cinemas Added')
                }
            });
        }
    });
    Movie.remove({}, (err) => {
        if(err){
            console.log(err);
        }
        console.log('Movie remove complete');
        Movie.create(Moviedata, (err,item) => {
            if(err){
                console.log(err);
            } else{
                console.log('Movie Added')
            }
        });
    });
    Theater.remove({}, (err) => {
        if(err){
            console.log(err);
        }
        console.log('Theater remove complete');
    });
    Seat.remove({}, (err) => {
        if(err){
            console.log(err);
        }
        console.log('Seat remove complete');
    });
    Showtime.remove({}, (err) => {
        if(err){
            console.log(err);
        }
        console.log('Showtime remove complete');
    });
    // User.remove({}, (err) => {
    //     if(err){
    //         console.log(err);
    //     } else {
    //         console.log('User remove complete');
    //     }
    // });

}

module.exports = seedDB;