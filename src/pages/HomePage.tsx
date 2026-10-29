import { Hero } from '../components/home/Hero';
import { Marquee } from '../components/home/Marquee';
import { Collection } from '../components/home/Collection';
import { ToppingLab } from '../components/home/ToppingLab';
import { LayerRoutine } from '../components/home/LayerRoutine';
import { Reviews } from '../components/home/Reviews';
import { Newsletter } from '../components/home/Newsletter';
import type { AddToCart } from '../types';

export function HomePage({ onAdd }: { onAdd: AddToCart }) {
  return (
    <main>
      <Hero />
      <Marquee />
      <Collection onAdd={onAdd} />
      <ToppingLab onAdd={onAdd} />
      <LayerRoutine />
      <Reviews />
      <Newsletter />
    </main>
  );
}
