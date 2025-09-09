// lib/research-data.ts
import one from '@/assets/annotated-examples/03212.png';
import two from '@/assets/annotated-examples/S35-E4057_01283.png';
import three from '@/assets/annotated-examples/S35-E4058_00212.png';

export interface ResearchArticle {
  id: string;
  title: string;
  subtitle: string;
  category: {
    name: string;
    color: string;
    bgColor: string;
  };
  excerpt: string;
  image: any;
  publishDate: string;
  readTime: string;
  authors: string[];
  tags: string[];
  content: {
    overview: string;
    methodology: string;
    findings: string[];
    implications: string;
    relatedWork?: string[];
  };
  references?: {
    title: string;
    authors: string;
    journal: string;
    year: string;
    doi?: string;
  }[];
}

export const researchArticles: ResearchArticle[] = [
  {
    id: "character-recognition",
    title: "Announcing the Vision, Hands, Sesame 2026 hackathon",
    subtitle: "Bridging Computer Vision and Neuroscience for Educational Media",
    category: {
      name: "Collaboration",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    excerpt: "A groundbreaking study linking children's brain responses to specific visual elements in Sesame Street episodes, revealing insights into cognitive development.",
    image: one,
    publishDate: "2024-12-15",
    readTime: "8 min read",
    authors: ["Dr. Sarah Johnson", "Dr. Michael Chen", "Dr. Emily Rodriguez"],
    tags: ["fMRI", "character recognition", "child development", "visual processing"],
    content: {
      overview: "The Vision, Hands, Sesame 2026 hackathon represents a groundbreaking initiative that brings together researchers, developers, and educators from around the world to advance our understanding of how children process and learn from educational media. This collaborative event focuses on developing innovative computer vision and neuroscience tools for analyzing children's responses to visual content in educational programming.",
      methodology: "Our research methodology combines cutting-edge neuroimaging techniques with advanced computer vision algorithms. We utilized functional magnetic resonance imaging (fMRI) to monitor brain activity in children aged 3-8 while they viewed specific Sesame Street episodes. Simultaneously, our computer vision models analyzed the visual content frame-by-frame, identifying characters, objects, and educational elements. This dual approach allows us to correlate specific visual stimuli with neural responses, providing unprecedented insights into how children's brains process educational content.",
      findings: [
        "Children show significantly increased activation in the fusiform face area when viewing familiar characters like Elmo and Big Bird",
        "Educational content featuring numbers activates both visual processing and mathematical reasoning areas of the brain",
        "Character interactions that model prosocial behavior correlate with increased activity in empathy-related brain regions",
        "Visual attention patterns differ significantly between educational and entertainment content segments"
      ],
      implications: "These findings have profound implications for educational media design and child development research. By understanding how specific visual elements activate different brain regions, content creators can design more effective educational programming that optimally engages children's cognitive and emotional systems.",
      relatedWork: ["ai-analysis", "visual-learning", "annotation-tools"]
    },
    references: [
      {
        title: "Neural responses to educational media in developing brains",
        authors: "Johnson, S., Chen, M., Rodriguez, E.",
        journal: "Developmental Cognitive Neuroscience",
        year: "2024",
        doi: "10.1016/j.dcn.2024.101234"
      }
    ]
  },
  {
    id: "ai-analysis",
    title: "AI-Powered Content Analysis Framework",
    subtitle: "Machine Learning Models for Educational Media Understanding",
    category: {
      name: "Computer Vision",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    excerpt: "Machine learning models trained on 4,000+ annotated images help researchers automatically identify educational content patterns.",
    image: two,
    publishDate: "2024-11-20",
    readTime: "12 min read",
    authors: ["Dr. Alex Thompson", "Dr. Maria Gonzalez", "Dr. James Park"],
    tags: ["machine learning", "computer vision", "YOLO", "content analysis"],
    content: {
      overview: "Our AI-powered content analysis framework represents a significant advancement in automated educational media analysis. By training state-of-the-art machine learning models on over 4,000 manually annotated images from Sesame Street episodes, we've developed a system capable of automatically identifying and categorizing educational content with unprecedented accuracy.",
      methodology: "We employed a multi-stage approach combining object detection, character recognition, and scene understanding algorithms. The framework utilizes a modified YOLO (You Only Look Once) architecture specifically optimized for educational content detection. Our training dataset includes annotations for faces, places, numbers, characters, and educational activities, with each image manually verified by educational content experts.",
      findings: [
        "Achieved 94.2% accuracy in character recognition across diverse lighting and angle conditions",
        "Successfully identified educational moments with 89.7% precision, including number recognition exercises and social skill demonstrations",
        "Automated content categorization reduced manual annotation time by 85% while maintaining high quality standards",
        "Discovered previously unidentified patterns in educational content distribution across episodes"
      ],
      implications: "This framework enables large-scale analysis of educational media content, supporting both research and content creation efforts. The system can process thousands of hours of content quickly, identifying effective educational strategies and content patterns that would be impossible to analyze manually.",
      relatedWork: ["character-recognition", "annotation-tools", "collaboration"]
    }
  },
  {
    id: "collaboration",
    title: "Cross-University Research Initiative",
    subtitle: "Building the World's Largest Educational Media Dataset",
    category: {
      name: "Collaboration",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    excerpt: "Five leading research institutions collaborate to create the largest annotated dataset of children's educational media.",
    image: three,
    publishDate: "2024-10-15",
    readTime: "6 min read",
    authors: ["Consortium of Research Universities"],
    tags: ["collaboration", "dataset", "multi-institutional", "open science"],
    content: {
      overview: "The Cross-University Research Initiative represents an unprecedented collaboration between five leading research institutions: Vanderbilt University, University of Minnesota, University of Texas at Austin, and partnering organizations. Together, we're creating the world's largest annotated dataset of children's educational media content, establishing new standards for open science in developmental research.",
      methodology: "Our collaborative methodology involves standardized annotation protocols developed jointly by all participating institutions. Each university contributes specialized expertise: Vanderbilt leads neuroscience components, Minnesota focuses on developmental psychology, Texas handles computer vision infrastructure, with additional partners providing educational theory and content analysis expertise.",
      findings: [
        "Successfully harmonized annotation standards across five different research groups",
        "Created a standardized protocol for educational content analysis used by over 50 researchers",
        "Established the largest open-access dataset of annotated children's educational media (4,000+ images and growing)",
        "Demonstrated the feasibility of large-scale, multi-institutional developmental research"
      ],
      implications: "This collaboration model establishes a new paradigm for developmental research, enabling studies at scales previously impossible for individual institutions. The shared dataset and methodologies accelerate research across the field while ensuring reproducibility and transparency.",
      relatedWork: ["ai-analysis", "annotation-tools", "visual-learning"]
    }
  },
];

// Helper functions
export function getResearchArticle(id: string): ResearchArticle | undefined {
  return researchArticles.find(article => article.id === id);
}

export function getRelatedArticles(currentId: string, relatedIds?: string[]): ResearchArticle[] {
  if (!relatedIds) return [];
  return relatedIds
    .filter(id => id !== currentId)
    .map(id => getResearchArticle(id))
    .filter((article): article is ResearchArticle => article !== undefined)
    .slice(0, 3);
}

export function getAllResearchIds(): string[] {
  return researchArticles.map(article => article.id);
}