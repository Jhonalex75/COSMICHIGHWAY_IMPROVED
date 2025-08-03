// asteroid-insights.ts
'use server';

/**
 * @fileOverview Generates educational insights about an asteroid's orbital characteristics.
 *
 * - asteroidInsights - A function that generates insights about an asteroid.
 * - AsteroidInsightsInput - The input type for the asteroidInsights function.
 * - AsteroidInsightsOutput - The return type for the asteroidInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AsteroidInsightsInputSchema = z.object({
  name: z.string().describe('The name of the asteroid.'),
  semiMajorAxis: z.number().describe('The semi-major axis of the asteroid in AU.'),
  eccentricity: z.number().describe('The eccentricity of the asteroid.'),
  inclination: z.number().describe('The inclination of the asteroid in degrees.'),
});
export type AsteroidInsightsInput = z.infer<typeof AsteroidInsightsInputSchema>;

const AsteroidInsightsOutputSchema = z.object({
  insights: z.string().describe('Educational insights about the asteroid.'),
});
export type AsteroidInsightsOutput = z.infer<typeof AsteroidInsightsOutputSchema>;

export async function asteroidInsights(input: AsteroidInsightsInput): Promise<AsteroidInsightsOutput> {
  return asteroidInsightsFlow(input);
}

const asteroidInsightsPrompt = ai.definePrompt({
  name: 'asteroidInsightsPrompt',
  input: {schema: AsteroidInsightsInputSchema},
  output: {schema: AsteroidInsightsOutputSchema},
  prompt: `You are an astronomy expert explaining asteroid characteristics to students.

  Given the following information about an asteroid, generate educational insights about its unique orbital characteristics, including the forces influencing it. Be concise and use language appropriate for high school students.

  Asteroid Name: {{{name}}}
  Semi-Major Axis: {{{semiMajorAxis}}} AU
  Eccentricity: {{{eccentricity}}}
  Inclination: {{{inclination}}} degrees
  `,
});

const asteroidInsightsFlow = ai.defineFlow(
  {
    name: 'asteroidInsightsFlow',
    inputSchema: AsteroidInsightsInputSchema,
    outputSchema: AsteroidInsightsOutputSchema,
  },
  async input => {
    const {output} = await asteroidInsightsPrompt(input);
    return output!;
  }
);
