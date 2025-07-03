import type { CategoryInfo, TypeInfo, TopicCategory, QuestionType } from '../types';

export const CATEGORY_INFO: Record<TopicCategory, CategoryInfo> = {
  'asosiy-til-xususiyatlari': {
    id: 'asosiy-til-xususiyatlari',
    name: 'Core Language Features',
    nameUz: 'Asosiy Til Xususiyatlari',
    description: 'Pattern matching, records, nullable reference types, file-scoped types va zamonaviy C# xususiyatlari',
    icon: '🏗️',
    color: '#FF6B6B'
  },
  'tip-tizimi-oop': {
    id: 'tip-tizimi-oop',
    name: 'Type System & OOP',
    nameUz: 'Tip Tizimi va OOP',
    description: 'Inheritance, polymorphism, interfaces, generics va obyekt-yo\'naltirilgan dasturlash',
    icon: '🎯',
    color: '#4ECDC4'
  },
  'metod-xususiyatlari': {
    id: 'metod-xususiyatlari',
    name: 'Method Features',
    nameUz: 'Metod Xususiyatlari',
    description: 'Parameters, extension methods, optional parameters va metod overloading',
    icon: '⚡',
    color: '#45B7D1'
  },
  'kolleksiyalar-ma\'lumot-tuzilmalari': {
    id: 'kolleksiyalar-ma\'lumot-tuzilmalari',
    name: 'Collections & Data Structures',
    nameUz: 'Kolleksiyalar va Ma\'lumot Tuzilmalari',
    description: 'List, Dictionary, Span, Memory, collection expressions va data structures',
    icon: '📦',
    color: '#F39C12'
  },
  'linq-funksional-dasturlash': {
    id: 'linq-funksional-dasturlash',
    name: 'LINQ & Functional Programming',
    nameUz: 'LINQ va Funksional Dasturlash',
    description: 'LINQ operators, query syntax, lambda expressions va funksional dasturlash',
    icon: '🔄',
    color: '#9B59B6'
  },
  'ilg\'or-mavzular': {
    id: 'ilg\'or-mavzular',
    name: 'Advanced Topics',
    nameUz: 'Ilg\'or Mavzular',
    description: 'Performance optimization, memory management, advanced patterns va best practices',
    icon: '🚀',
    color: '#E74C3C'
  },
  'exception-handling': {
    id: 'exception-handling',
    name: 'Exception Handling',
    nameUz: 'Exception Handling',
    description: 'Try-catch, finally, custom exceptions, exception filtering, re-throwing va exception best practices',
    icon: '⚠️',
    color: '#FF9800'
  }
};

export const TYPE_INFO: Record<QuestionType, TypeInfo> = {
  'mcq': {
    id: 'mcq',
    name: 'Multiple Choice',
    nameUz: 'Ko\'p Tanlovli',
    description: 'Bir nechta variantdan to\'g\'ri javobni tanlash',
    icon: '✅',
    color: '#2ECC71'
  },
  'true_false': {
    id: 'true_false',
    name: 'True/False',
    nameUz: 'To\'g\'ri/Noto\'g\'ri',
    description: 'Berilgan bayonotning to\'g\'ri yoki noto\'g\'ri ekanligini aniqlash',
    icon: '🔄',
    color: '#3498DB'
  },
  'fill': {
    id: 'fill',
    name: 'Fill in the Blank',
    nameUz: 'Bo\'shliqni To\'ldirish',
    description: 'Kodda bo\'sh joylarni to\'g\'ri kod bilan to\'ldirish',
    icon: '📝',
    color: '#F39C12'
  },
  'error_spotting': {
    id: 'error_spotting',
    name: 'Error Spotting',
    nameUz: 'Xatolarni Topish',
    description: 'Kodda mavjud xatolarni topish va tuzatish',
    icon: '🔍',
    color: '#E67E22'
  },
  'output_prediction': {
    id: 'output_prediction',
    name: 'Output Prediction',
    nameUz: 'Natijani Bashorat Qilish',
    description: 'Berilgan kodning natijasini bashorat qilish',
    icon: '🎯',
    color: '#9B59B6'
  },
  'code_writing': {
    id: 'code_writing',
    name: 'Code Writing',
    nameUz: 'Kod Yozish',
    description: 'Berilgan vazifani hal qilish uchun kod yozish',
    icon: '💻',
    color: '#E74C3C'
  }
};

// Difficulty level information
export const DIFFICULTY_INFO = {
  'boshlang\'ich': {
    name: 'Beginner',
    nameUz: 'Boshlang\'ich',
    color: '#2ECC71',
    icon: '🟢'
  },
  'o\'rta': {
    name: 'Intermediate',
    nameUz: 'O\'rta',
    color: '#F39C12',
    icon: '🟡'
  },
  'murakkab': {
    name: 'Advanced',
    nameUz: 'Murakkab',
    color: '#E74C3C',
    icon: '🔴'
  }
}; 