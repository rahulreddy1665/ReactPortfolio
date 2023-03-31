import self from '../img/self.jpg';
import { colors } from '../colors/mainGradient';

export const info = {
  firstName: 'Rahul',
  lastName: 'Reddy',
  initials: 'RR', // the example uses first and last, but feel free to use three or more if you like.
  position: 'a mobile app Developer',
  selfPortrait: self, // don't change this unless you want to name your self-portrait in the "img" folder something else!
  gradient: `-webkit-linear-gradient(135deg, ${colors})`, // don't change this either
  baseColor: colors[0],
  miniBio: [
    // these are just some "tidbits" about yourself. You can look at mine https://paytonjewell.github.io/#/ for an example if you'd like
    {
      emoji: '🇮🇳',
      text: 'Bengaluru, India',
    },
    {
      emoji: '📱',
      text: 'Mobile App Developer at AgileIdc',
    },
    {
      emoji: '📧',
      text: 'rahulreddy1665@gmail.com',
    },
  ],
  socials: [
    {
      link: 'https://rahulreddy10.netlify.app/resume.pdf', // this should be https://yourname.com/resume.pdf once you've deployed
      icon: 'fa fa-user-circle',
      label: 'resume',
    },
    {
      link: 'https://instagram.com/rahulweezy?igshid=MWI4MTIyMDE=}',
      icon: 'fa fa-instagram',
      label: 'instagram',
    },
    {
      link: 'https://github.com/rahulreddy1665',
      icon: 'fa fa-github',
      label: 'github',
    },
    {
      link: 'https://www.linkedin.com/in/rahul-reddy-t-v-ba0806190',
      icon: 'fa fa-linkedin',
      label: 'linkedin',
    },
    {
      link: 'https://twitter.com/Rahulweezy',
      icon: 'fa fa-twitter',
      label: 'twitter',
    },
  ],
  bio: `Hello! I am a React Native developer with 2 years of experience in React Native and React JS. My skills include developing cross-platform mobile applications, using popular libraries and tools such as Redux, Axios.
  I have experience in implementing UI designs, integrating APIs, handling data persistence & mobile development processes such as App Store and Google Play Store submission.`,
  
  
  skills: {
    // you dont havew to strictly follow the 'languages', 'frameworks', 'databases', 'cloudServices', and 'tools' categories. You can add your own if you'd like.
    // but the structure should be the same, an array of strings and the key should be one word, no spaces.
    languages: [ 'JavaScript','HTML/CSS','Dart'],
    frameworks: [
      'React native',
      'React',
      'Redux',
      'Flutter',
      'Material UI',
      'Nodejs',
      'Mantine'
    ],
    databases: ['MySQl',],
    cloudServices: ['AWS S3', 'AWS EC2','Heroku', 'Netlify'],
    tools: [
      'Git',
      'Postman',
      'Jira',
      'Bitbucket',
      'Xcode',
      'Android Studio',
    ],
  },
  hobbies: [
    {
      label: 'Coins Collection',
      emoji: '🪙',
    },
    {
      label: 'Anime',
      emoji: '🎞',
    },
    {
      label: 'Football',
      emoji: '⚽',
    },
    {
      label: 'Traveling',
      emoji: '✈️',
    },
   
   
  ],
  portfolio: [
    // This is where your portfolio projects will be detailed
    //   for the null ones, the button will not show up
    {
      title: 'React Native Portfolio',
      live: null, //this should be a link to the live version of your project, think github pages, netlify, heroku, etc. Or your own domain, if you have it.
      source: 'https://github.com/rahulreddy1665/Portfolio', // this should be a link to the **repository** of the project, where the code is hosted.
      
    },
    {
      title: 'React Js Portfolio',
      live: null,
      source: 'https://github.com/rahulreddy1665/ReactPortfolio',
      
    },
    {
      title: 'Ecommerce Application',
      live: "https://play.google.com/store/apps/details?id=com.lifestylesapp", //this should be a link to the live version of your project, think github pages, netlify, heroku, etc. Or your own domain, if you have it.
     
    },
    {
      title: 'Veterinary application',
      live:'https://play.google.com/store/apps/details?id=com.readyvetapp',      
    },
    
  ],
};
