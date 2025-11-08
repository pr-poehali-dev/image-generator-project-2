import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface ReferenceImage {
  id: string;
  file: File;
  preview: string;
}

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 10;

  const exampleImages = [
    {
      url: 'https://cdn.poehali.dev/projects/156e88b1-67a4-4fbe-adbe-c744f6b26529/files/4802fa50-947b-437e-a079-726c5ec6833f.jpg',
      prompt: 'Абстрактное цифровое искусство с фиолетовыми градиентами'
    },
    {
      url: 'https://cdn.poehali.dev/projects/156e88b1-67a4-4fbe-adbe-c744f6b26529/files/768d25a3-4cd8-45e7-bd8a-af2661e65145.jpg',
      prompt: 'Футуристический пейзаж с горами на закате'
    },
    {
      url: 'https://cdn.poehali.dev/projects/156e88b1-67a4-4fbe-adbe-c744f6b26529/files/09184d19-ced0-4a53-94f5-c9c2d859a53a.jpg',
      prompt: 'Архитектурная визуализация с фиолетовым освещением'
    }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (referenceImages.length + files.length > MAX_IMAGES) {
      toast.error(`Максимум ${MAX_IMAGES} изображений`);
      return;
    }

    const newImages: ReferenceImage[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));

    setReferenceImages(prev => [...prev, ...newImages]);
    
    if (e.target) {
      e.target.value = '';
    }
  };

  const removeImage = (id: string) => {
    setReferenceImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Введите описание изображения');
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      toast.success(`Изображение создано! (Демо-режим${referenceImages.length > 0 ? ` с ${referenceImages.length} референсами` : ''})`);
    }, 2000);
  };

  const useExamplePrompt = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
            <Icon name="Sparkles" size={16} />
            <span>Генерация изображений с ИИ</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">
            Превратите слова
            <br />
            <span className="text-primary">в изображения</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Создавайте уникальные изображения из текстовых описаний с помощью искусственного интеллекта
          </p>
        </div>

        {/* Generator Form */}
        <div className="max-w-3xl mx-auto mt-16 animate-scale-in">
          <Card className="border-2 shadow-lg">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Icon name="Pencil" size={16} />
                  Опишите желаемое изображение
                </label>
                <Textarea
                  placeholder="Например: Футуристический город на закате с летающими автомобилями..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] text-base resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  Будьте максимально детальны в описании для лучших результатов
                </p>
              </div>

              {/* Reference Images Section */}
              <div className="space-y-3 pt-2 border-t">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Icon name="Images" size={16} />
                  Референсные изображения (до {MAX_IMAGES})
                  <span className="text-muted-foreground font-normal">
                    • Опционально
                  </span>
                </label>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Reference Images Grid */}
                <div className="grid grid-cols-5 gap-3">
                  {referenceImages.map((image) => (
                    <div key={image.id} className="relative group aspect-square">
                      <img
                        src={image.preview}
                        alt="Reference"
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Add Image Button */}
                  {referenceImages.length < MAX_IMAGES && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <Icon name="Plus" size={20} className="text-gray-400" />
                      <span className="text-xs text-gray-500">Добавить</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  Загрузите изображения для стилистического референса. ИИ будет учитывать их композицию, цветовую гамму и стиль при генерации.
                </p>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                size="lg"
                className="w-full text-base font-semibold h-14 hover-scale"
              >
                {isGenerating ? (
                  <>
                    <Icon name="Loader2" size={20} className="animate-spin" />
                    <span>Генерируем...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Wand2" size={20} />
                    <span>Создать изображение</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto mt-24 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: 'Zap',
              title: 'Мгновенная генерация',
              description: 'Получите результат за секунды'
            },
            {
              icon: 'Images',
              title: 'Референсы',
              description: 'Загрузите до 10 референсных фото'
            },
            {
              icon: 'Download',
              title: 'Высокое качество',
              description: 'Изображения в HD разрешении'
            }
          ].map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Icon name={feature.icon as any} size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">
                Галерея примеров
              </h2>
              <p className="text-xl text-muted-foreground">
                Вдохновитесь работами, созданными нашим ИИ
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {exampleImages.map((image, index) => (
                <div 
                  key={index}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer hover-scale"
                  onClick={() => useExamplePrompt(image.prompt)}
                >
                  <img 
                    src={image.url} 
                    alt={image.prompt}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="text-sm font-medium mb-2">{image.prompt}</p>
                      <div className="flex items-center gap-2 text-xs opacity-80">
                        <Icon name="MousePointerClick" size={14} />
                        <span>Нажмите, чтобы использовать промпт</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Готовы создать
            <br />
            что-то удивительное?
          </h2>
          <p className="text-xl text-muted-foreground">
            Начните генерировать изображения прямо сейчас
          </p>
          <Button 
            size="lg" 
            className="text-base font-semibold h-14 px-8 hover-scale"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Icon name="ArrowUp" size={20} />
            <span>Начать создавать</span>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 ИИ Генератор. Создано с помощью передовых технологий.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
