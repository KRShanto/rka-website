// Move the data to a separate file to reduce the main component size
export type BlackBeltProfile = {
  userId: string
  name: string
  fullName: string
  dan: string
  date: string
  image: string
  birthday: string
  gender: string
  joinDate: string
  blackBeltDate: string
  email: string
  phone: string
  address: string
  bio: string
  achievements: string[]
}

export const blackBeltProfiles: BlackBeltProfile[] = [
  {
    userId: "BWKD001",
    name: "Abdul Sukkur Ali Shikder",
    fullName: "Abdul Sukkur Ali Shikder",
    dan: "6th Dan",
    date: "January 15, 2005",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sukkur-CPuPQFW1Y4pZogkeSgjHBsbEPnw5vP.jpeg",
    birthday: "March 12, 1975",
    gender: "Male",
    joinDate: "February 10, 1995",
    blackBeltDate: "January 15, 2005",
    email: "sukkur@bwkd.org",
    phone: "+880 1XXX-XXXXXX",
    address: "Dhaka, Bangladesh",
    bio: "Abdul Sukkur Ali Shikder is a highly respected 6th Dan black belt and one of the founding members of Bangladesh Wadokai Karate-Do. With over 25 years of experience, he has trained numerous champions and represented Bangladesh in international competitions.",
    achievements: [
      "Gold Medal - Asian Karate Championship 2010",
      "Best Coach Award - National Sports Council 2015",
      "Lifetime Achievement Award - Bangladesh Karate Federation 2020",
    ],
  },
  {
    userId: "BWKD002",
    name: "Sharuk Khan Raj",
    fullName: "Sharuk Khan Raj",
    dan: "4th Dan",
    date: "March 22, 2010",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/srk-IaKF8bBdIYdep3yGT0Yoz2kwfR7H0a.jpeg",
    birthday: "July 8, 1985",
    gender: "Male",
    joinDate: "April 5, 2000",
    blackBeltDate: "March 22, 2010",
    email: "sharuk@bwkd.org",
    phone: "+880 1XXX-XXXXXX",
    address: "Dhaka, Bangladesh",
    bio: "Sharuk Khan Raj is a dedicated 4th Dan black belt with a passion for teaching karate to the next generation. He has been instrumental in expanding BWKD's presence across Bangladesh and has led the team to multiple international victories.",
    achievements: [
      "Silver Medal - South Asian Games 2016",
      "Coach of the Year - Bangladesh Sports Association 2018",
      "Gold Medal - National Karate Championship 2014",
    ],
  },
  {
    userId: "BWKD003",
    name: "TH Tanjim",
    fullName: "Tanvir Hasan Tanjim",
    dan: "3rd Dan",
    date: "November 5, 2012",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tanjim-pyoBmEdeoAHaxOmndYQkWT6Gc92ETb.jpeg",
    birthday: "October 15, 1990",
    gender: "Male",
    joinDate: "January 20, 2005",
    blackBeltDate: "November 5, 2012",
    email: "tanjim@bwkd.org",
    phone: "+880 1XXX-XXXXXX",
    address: "Dhaka, Bangladesh",
    bio: "Tanvir Hasan Tanjim is a talented 3rd Dan black belt known for his exceptional kata performances. He has represented Bangladesh in numerous international competitions and is dedicated to preserving the traditional aspects of Wadokai Karate.",
    achievements: [
      "Gold Medal - Kata Division, South Asian Championship 2018",
      "Best Technical Performer - National Games 2019",
      "Bronze Medal - Asian Karate Championship 2017",
    ],
  },
  {
    userId: "BWKD004",
    name: "Forkan",
    fullName: "Mohammad Forkan Ahmed",
    dan: "3rd Dan",
    date: "July 18, 2013",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/forkan-70IUALFPGyIJTxqM4XVeaKrP08uv2x.jpeg",
    birthday: "September 3, 1992",
    gender: "Male",
    joinDate: "March 15, 2006",
    blackBeltDate: "July 18, 2013",
    email: "forkan@bwkd.org",
    phone: "+880 1XXX-XXXXXX",
    address: "Dhaka, Bangladesh",
    bio: "Mohammad Forkan Ahmed is a dynamic 3rd Dan black belt specializing in kumite. His aggressive yet controlled fighting style has earned him numerous medals in national and international competitions. He is also a dedicated instructor at the main dojo.",
    achievements: [
      "Gold Medal - Kumite Division, National Championship 2019",
      "Silver Medal - South Asian Games 2018",
      "Best Fighter Award - Bangladesh Karate League 2020",
    ],
  },
  {
    userId: "BWKD005",
    name: "Rony Islam Ripon",
    fullName: "Rony Islam Ripon",
    dan: "3rd Dan",
    date: "September 30, 2014",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unknownpersonimg.jpg-ECcz9FhlPE735MrZ1EIlZAOSemRubx.jpeg",
    birthday: "April 22, 1991",
    gender: "Male",
    joinDate: "June 10, 2007",
    blackBeltDate: "September 30, 2014",
    email: "rony@bwkd.org",
    phone: "+880 1XXX-XXXXXX",
    address: "Dhaka, Bangladesh",
    bio: "Rony Islam Ripon is a versatile 3rd Dan black belt with expertise in both kata and kumite. He has been a key member of the national team and has contributed significantly to the development of young talent at BWKD.",
    achievements: [
      "Gold Medal - Team Kata, National Championship 2018",
      "Silver Medal - Individual Kumite, South Asian Championship 2019",
      "Best All-Around Performer - Bangladesh Karate Federation 2017",
    ],
  },
  {
    userId: "BWKD006",
    name: "Kanij Fatema Eva",
    fullName: "Kanij Fatema Eva",
    dan: "2nd Dan",
    date: "February 12, 2016",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unknownpersonimg.jpg-ECcz9FhlPE735MrZ1EIlZAOSemRubx.jpeg",
    birthday: "May 17, 1995",
    gender: "Female",
    joinDate: "August 5, 2010",
    blackBeltDate: "February 12, 2016",
    email: "eva@bwkd.org",
    phone: "+880 1XXX-XXXXXX",
    address: "Dhaka, Bangladesh",
    bio: "Kanij Fatema Eva is a pioneering female 2nd Dan black belt who has broken barriers in the male-dominated karate scene in Bangladesh. She has inspired many young girls to take up martial arts and has been a strong advocate for women in sports.",
    achievements: [
      "Gold Medal - Women's Kata, National Championship 2019",
      "Best Female Karateka - Bangladesh Sports Awards 2020",
      "Silver Medal - South Asian Games 2018",
    ],
  },
  {
    userId: "BWKD007",
    name: "SK Mostofa Hasan",
    fullName: "Sheikh Mostofa Hasan",
    dan: "2nd Dan",
    date: "April 8, 2017",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sk.jpg-p41OviwOQth8DcNq2CdWjq6XBhEQde.jpeg",
    birthday: "December 10, 1996",
    gender: "Male",
    joinDate: "July 15, 2011",
    blackBeltDate: "April 8, 2017",
    email: "mostofa@bwkd.org",
    phone: "+880 1XXX-XXXXXX",
    address: "Dhaka, Bangladesh",
    bio: "Sheikh Mostofa Hasan is a dedicated 2nd Dan black belt known for his precision and technical excellence. He has been instrumental in organizing national tournaments and has represented Bangladesh in several international competitions.",
    achievements: [
      "Gold Medal - Team Kumite, National Championship 2020",
      "Silver Medal - Individual Kata, South Asian Championship 2019",
      "Best Technical Performer - Bangladesh Karate League 2018",
    ],
  },
  {
    userId: "BWKD008",
    name: "Mirdul",
    fullName: "Mirdul Rahman",
    dan: "1st Dan",
    date: "October 25, 2018",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unknownpersonimg.jpg-ECcz9FhlPE735MrZ1EIlZAOSemRubx.jpeg",
    birthday: "August 5, 1998",
    gender: "Male",
    joinDate: "September 12, 2013",
    blackBeltDate: "October 25, 2018",
    email: "mirdul@bwkd.org",
    phone: "+880 1XXX-XXXXXX",
    address: "Dhaka, Bangladesh",
    bio: "Mirdul Rahman is a promising 1st Dan black belt with exceptional potential. His dedication to the art and competitive spirit have earned him recognition as one of the rising stars of BWKD.",
    achievements: [
      "Gold Medal - Junior Kumite, National Championship 2019",
      "Most Promising Talent Award - Bangladesh Karate Federation 2020",
      "Bronze Medal - South Asian Junior Championship 2018",
    ],
  },
  {
    userId: "BWKD009",
    name: "Ashikur Rahaman",
    fullName: "Ashikur Rahaman",
    dan: "1st Dan",
    date: "June 14, 2019",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unknownpersonimg.jpg-ECcz9FhlPE735MrZ1EIlZAOSemRubx.jpeg",
    birthday: "January 30, 1999",
    gender: "Male",
    joinDate: "March 5, 2014",
    blackBeltDate: "June 14, 2019",
    email: "ashikur@bwkd.org",
    phone: "+880 1XXX-XXXXXX",
    address: "Dhaka, Bangladesh",
    bio: "Ashikur Rahaman is a disciplined 1st Dan black belt with a focus on traditional karate techniques. His commitment to the philosophical aspects of martial arts has made him a respected member of the BWKD community.",
    achievements: [
      "Silver Medal - Kata Division, National Championship 2020",
      "Best Spirit Award - Bangladesh Karate League 2019",
      "Bronze Medal - Team Kumite, South Asian Championship 2021",
    ],
  },
  {
    userId: "BWKD010",
    name: "Mahfuzur Rahman",
    fullName: "Mahfuzur Rahman",
    dan: "1st Dan",
    date: "March 3, 2020",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unknownpersonimg.jpg-ECcz9FhlPE735MrZ1EIlZAOSemRubx.jpeg",
    birthday: "November 12, 2000",
    gender: "Male",
    joinDate: "January 20, 2015",
    blackBeltDate: "March 3, 2020",
    email: "mahfuz@bwkd.org",
    phone: "+880 1XXX-XXXXXX",
    address: "Dhaka, Bangladesh",
    bio: "Mahfuzur Rahman is an energetic 1st Dan black belt who excels in kumite. His quick reflexes and strategic approach to fighting have earned him several medals in national competitions.",
    achievements: [
      "Gold Medal - Junior Kumite, National Championship 2021",
      "Most Improved Karateka - BWKD Annual Awards 2020",
      "Silver Medal - Team Kata, Bangladesh Games 2019",
    ],
  },
  {
    userId: "BWKD011",
    name: "Tahmina Akter",
    fullName: "Tahmina Akter",
    dan: "1st Dan",
    date: "August 22, 2021",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unknownpersonimg.jpg-ECcz9FhlPE735MrZ1EIlZAOSemRubx.jpeg",
    birthday: "July 25, 2001",
    gender: "Female",
    joinDate: "April 10, 2016",
    blackBeltDate: "August 22, 2021",
    email: "tahmina@bwkd.org",
    phone: "+880 1XXX-XXXXXX",
    address: "Dhaka, Bangladesh",
    bio: "Tahmina Akter is a determined 1st Dan black belt who has overcome numerous obstacles to achieve excellence in karate. She is an inspiration to many young women and actively promotes martial arts among girls in Bangladesh.",
    achievements: [
      "Gold Medal - Women's Kumite, National Championship 2022",
      "Best Female Newcomer - Bangladesh Karate Federation 2021",
      "Bronze Medal - South Asian Women's Championship 2022",
    ],
  },
  {
    userId: "BWKD012",
    name: "Md. Rakibul Islam",
    fullName: "Mohammad Rakibul Islam",
    dan: "1st Dan",
    date: "January 10, 2022",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unknownpersonimg.jpg-ECcz9FhlPE735MrZ1EIlZAOSemRubx.jpeg",
    birthday: "February 18, 2002",
    gender: "Male",
    joinDate: "June 5, 2017",
    blackBeltDate: "January 10, 2022",
    email: "rakib@bwkd.org",
    phone: "+880 1XXX-XXXXXX",
    address: "Dhaka, Bangladesh",
    bio: "Mohammad Rakibul Islam is a talented 1st Dan black belt with exceptional potential in both kata and kumite. His dedication to training and continuous improvement has made him one of the most promising young karatekas in BWKD.",
    achievements: [
      "Gold Medal - Junior Kata, National Championship 2022",
      "Rising Star Award - Bangladesh Karate League 2021",
      "Silver Medal - Team Kumite, South Asian Junior Championship 2022",
    ],
  },
]

// Create a simplified version for the listing page
export const blackBeltsBasic = blackBeltProfiles.map((profile) => ({
  name: profile.name,
  dan: profile.dan,
  date: profile.date,
  userId: profile.userId,
  image: profile.image,
}))

// Helper function to get a profile by ID
export function getProfileById(id: string): BlackBeltProfile | undefined {
  return blackBeltProfiles.find((profile) => profile.userId === id)
}

