import OpenAI from 'openai';
import ChildProfile from '../models/ChildProfile';

export class StoryService {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'your-key-here',
  });

  static async generateStory(childId: string, theme: string) {
    const profile = await ChildProfile.findById(childId).exec();
    if (!profile) throw new Error('Child profile not found');

    const recentWords = profile.progress
      .slice(-5)
      .map(p => p.moduleName)
      .join(', ');

    const prompt = `Write a short, magical bedtime story for a ${profile.age}-year-old child named ${profile.name}. 
    The theme is "${theme}". 
    The story should be simple, encouraging, and include these educational themes: ${recentWords}. 
    Keep it under 200 words and end with a gentle positive message.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    return {
      childName: profile.name,
      theme,
      content: response.choices[0].message.content,
      generatedAt: new Date(),
    };
  }

  static async generateTeacherPreview(theme: string) {
    const prompt = `Write a short, magical educational story for a group of 5-year-old children. 
    The theme is "${theme}". 
    The story should be simple, highly engaging, and end with an interactive question for the class. 
    Keep it under 150 words.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    return {
      theme,
      content: response.choices[0].message.content,
      generatedAt: new Date(),
    };
  }
}
