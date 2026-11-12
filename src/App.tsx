import { useMemo, useState } from 'react'
import {
  ChefHat, Clock3, Heart, Home, BookOpen, Plus, Search, X,
  Refrigerator, Beer, Sparkles, Utensils, RotateCcw
} from 'lucide-react'

type Recipe = {
  id: number
  title: string
  ingredients: string[]
  time: number
  level: string
  pairing: string
  description: string
  steps: string[]
  image: string
  tags: string[]
}

const recipes: Recipe[] = [
  {
    id: 1, title: 'キャベツとチーズのふわとろ焼き',
    ingredients: ['卵', 'チーズ', 'キャベツ'], time: 10, level: 'かんたん',
    pairing: 'ビールに◎', description: '外はこんがり、中はふわとろ。冷蔵庫の定番食材で作れる満足おつまみ。',
    steps: ['キャベツを千切りにする', '卵を溶き、チーズとキャベツを混ぜる', '油をひいたフライパンで両面をこんがり焼く', 'お好みで黒こしょうやソースをかける'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=85',
    tags: ['フライパン', '節約']
  },
  {
    id: 2, title: 'ベーコンと卵のカリカリ炒め',
    ingredients: ['ベーコン', '卵'], time: 8, level: 'かんたん',
    pairing: 'ハイボールに◎', description: 'ベーコンのうまみを卵にまとわせた、あと一品にぴったりの一皿。',
    steps: ['ベーコンを食べやすい大きさに切る', 'フライパンでベーコンをカリッと炒める', '卵を加えて好みの固さまで炒める', '塩・こしょうで味を整える'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=85',
    tags: ['時短', 'フライパン']
  },
  {
    id: 3, title: 'じゃがいものチーズガレット',
    ingredients: ['じゃがいも', 'チーズ'], time: 15, level: 'ふつう',
    pairing: 'ワインに◎', description: '細切りじゃがいもをカリッと焼いて、チーズで香ばしく。',
    steps: ['じゃがいもを細い千切りにする', 'チーズと塩少々を混ぜる', 'フライパンに薄く広げて押さえながら焼く', '焼き色がついたら裏返して両面を焼く'],
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1000&q=85',
    tags: ['節約', 'カリカリ']
  },
  {
    id: 4, title: 'トマトとツナのさっぱり和え',
    ingredients: ['トマト', 'ツナ'], time: 5, level: 'かんたん',
    pairing: 'レモンサワーに◎', description: '切って和えるだけ。さっぱり食べたい夜におすすめ。',
    steps: ['トマトをひと口大に切る', 'ツナの油を軽く切る', 'オリーブオイル・塩・酢で和える', 'あれば大葉や黒こしょうを添える'],
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85',
    tags: ['火を使わない', '5分']
  },
  {
    id: 5, title: 'きのこのバター醤油ソテー',
    ingredients: ['しめじ', 'えのき', 'バター'], time: 7, level: 'かんたん',
    pairing: '日本酒に◎', description: 'きのこの香りとバター醤油が食欲をそそる定番おつまみ。',
    steps: ['きのこを食べやすくほぐす', 'フライパンでバターを溶かす', 'きのこをしんなりするまで炒める', '醤油を回しかけて完成'],
    image: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?auto=format&fit=crop&w=1000&q=85',
    tags: ['低コスト', 'フライパン']
  },
  {
    id: 6, title: 'きゅうりのやみつき塩こんぶ',
    ingredients: ['きゅうり', '塩こんぶ'], time: 5, level: 'かんたん',
    pairing: 'ビールに◎', description: 'ポリ袋で揉むだけ。箸が止まらないスピードおつまみ。',
    steps: ['きゅうりをたたいて食べやすく割る', 'ポリ袋にきゅうりと塩こんぶを入れる', 'ごま油を少量加えて揉み込む', '5分ほど置いて味をなじませる'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=85',
    tags: ['火を使わない', '5分']
  }
]

const starterIngredients = ['卵', 'チーズ', 'キャベツ', 'ベーコン']
const popularIngredients = ['じゃがいも', 'トマト', 'ツナ', 'しめじ', 'えのき', 'バター', 'きゅうり', '塩こんぶ']

export default function App() {
  const [ingredients, setIngredients] = useState<string[]>(starterIngredients)
  const [draft, setDraft] = useState('')
  const [searched, setSearched] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [selected, setSelected] = useState<Recipe | null>(null)
  const [tab, setTab] = useState<'home' | 'favorites' | 'guide'>('home')

  const results = useMemo(() => {
    const source = tab === 'favorites' ? recipes.filter(r => favorites.includes(r.id)) : recipes
    if (!searched && tab !== 'favorites') return [recipes[0], recipes[1], recipes[3]]
    return source
      .map(recipe => ({ recipe, score: recipe.ingredients.filter(i => ingredients.includes(i)).length }))
      .filter(item => tab === 'favorites' || item.score > 0)
      .sort((a, b) => b.score - a.score || a.recipe.time - b.recipe.time)
      .map(item => item.recipe)
  }, [ingredients, searched, favorites, tab])

  const addIngredient = (value = draft) => {
    const name = value.trim()
    if (name && !ingredients.includes(name)) setIngredients(current => [...current, name])
    setDraft('')
  }