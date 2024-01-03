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
      text: 'React Native Developer at Agilets PVT LTD',
    },
    {
      emoji: '📧',
      text: 'rahulreddy1665@gmail.com',
    },
  ],
  socials: [
    {
      link: 'https://rahulreddy10.netlify.app/resume.pdf', 
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
      link: 'https://www.linkedin.com/in/rahulreddyTV',
      icon: 'fa fa-linkedin',
      label: 'linkedin',
    },
    {
      link: 'https://twitter.com/Rahulweezy',
      icon: 'fa fa-twitter',
      label: 'twitter',
    },
  ],
  bio: `Hello! I am Rahul Reddy, a skilled React Native developer with 2.6 years of experience in React Native and React JS. I specialize in developing cross-platform mobile applications, utilizing popular libraries and tools like Redux and Axios. With a strong background in UI design implementation and API integration, I excel in handling data persistence and the mobile development processes, including App Store and Google Play Store submission.`,
  
  
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
      live: "https://rahulreddy10.netlify.app/",
    },
    {
      title: 'Task Manager(Flutter)',
      live: null,
      source:'https://github.com/rahulreddy1665/Todo_app_Flutter.git', //this should be a link to the live version of your project, think github pages, netlify, heroku, etc. Or your own domain, if you have it.
     
    },
    {
      title: 'Pharmaceutical Website',
      live:'https://invitehealthspecialities.com/',      
    },
    
  ],
};
