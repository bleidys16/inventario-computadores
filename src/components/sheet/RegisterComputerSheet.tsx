import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useInventoryStore } from '../../store/useInventoryStore';
import { X, Laptop, Plus, AlertCircle } from 'lucide-react';

export const RegisterComputerSheet: React.FC = () => {
  const { isRegisterDrawerOpen, closeRegisterDrawer, addComputer } = useInventoryStore();

  const [id, setId] = useState('');
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Lenovo');
  const [model, setModel] = useState('');
  const [processor, setProcessor] = useState('');
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [location, setLocation] = useState('Bodega Central');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setId('');
    setBarcode('');
    setName('');
    setBrand('Lenovo');
    setModel('');
    setProcessor('');
    setRam('');
    setStorage('');
    setLocation('Bodega Central');
    setNotes('');
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('El nombre o modelo del equipo es obligatorio.');
      return;
    }
    if (!brand.trim() || !model.trim()) {
      setError('La marca y el modelo son obligatorios.');
      return;
    }
    if (!processor.trim()) {
      setError('Por favor indica el procesador (CPU).');
      return;
    }
    if (!ram.trim() || !storage.trim()) {
      setError('La memoria RAM y el almacenamiento son requeridos.');
      return;
    }

    addComputer({
      id: id.trim() || `AST-${Math.floor(100 + Math.random() * 900)}`,
      barcode: barcode.trim() || `${Date.now()}`,
      name: name.trim(),
      brand: brand.trim(),
      model: model.trim(),
      processor: processor.trim(),
      ram: ram.trim(),
      storage: storage.trim(),
      location: location.trim() || 'Bodega Central',
      notes: notes.trim() || undefined,
    });

    resetForm();
    closeRegisterDrawer();
  };

  return (
    <Dialog.Root open={isRegisterDrawerOpen} onOpenChange={(open) => !open && closeRegisterDrawer()}>
      <Dialog.Portal>
        {/* Overlay translúcido desenfocado */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Panel lateral derecho (Drawer/Sheet) en Modo Claro */}
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-brand-300/60 shadow-2xl flex flex-col justify-between p-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300 ease-out focus:outline-none">
          
          {/* Header del Drawer */}
          <div className="p-6 border-b border-brand-300/40 bg-stone-50/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 border border-brand-300/60 flex items-center justify-center text-brand-600">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-stone-900">
                  Nuevo Computador
                </Dialog.Title>
                <Dialog.Description className="text-xs text-stone-500">
                  Registra un equipo en tu inventario institucional
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
                aria-label="Cerrar panel"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Formulario limpio sin demos */}
          <form id="register-computer-form" onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Código / ID y Código de Barras */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Código / ID
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Ej: AST-101"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-mono text-xs focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Código de Barras
                </label>
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Ej: 770928374011"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-mono text-xs focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>
            </div>

            {/* Nombre del Equipo */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nombre del Equipo <span className="text-brand-600">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: MacBook Pro 14, Dell Latitude, ThinkPad T14..."
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
              />
            </div>

            {/* Marca y Modelo */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Marca <span className="text-brand-600">*</span>
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                >
                  <option value="Apple">Apple</option>
                  <option value="Dell">Dell</option>
                  <option value="Lenovo">Lenovo</option>
                  <option value="HP">HP</option>
                  <option value="ASUS">ASUS</option>
                  <option value="Acer">Acer</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Modelo <span className="text-brand-600">*</span>
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Ej: XPS 15 9530, ThinkPad X1..."
                  required
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>
            </div>

            {/* Procesador (CPU) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Procesador (CPU) <span className="text-brand-600">*</span>
              </label>
              <input
                type="text"
                value={processor}
                onChange={(e) => setProcessor(e.target.value)}
                placeholder="Ej: Intel Core i7-13700H, AMD Ryzen 7, Apple M3 Pro..."
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
              />
            </div>

            {/* RAM y Almacenamiento */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Memoria RAM <span className="text-brand-600">*</span>
                </label>
                <input
                  type="text"
                  value={ram}
                  onChange={(e) => setRam(e.target.value)}
                  placeholder="Ej: 16 GB DDR5"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Almacenamiento <span className="text-brand-600">*</span>
                </label>
                <input
                  type="text"
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                  placeholder="Ej: 512 GB NVMe SSD"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                />
              </div>
            </div>

            {/* Ubicación Inicial */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Ubicación Inicial
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
              >
                <option value="Bodega Central">Bodega Central</option>
                <option value="Sala de Innovación">Sala de Innovación</option>
                <option value="Laboratorio de IA">Laboratorio de IA</option>
                <option value="Sala de Desarrollo">Sala de Desarrollo</option>
                <option value="Taller de Soporte TI">Taller de Soporte TI</option>
              </select>
            </div>

            {/* Notas opcionales */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Notas / Observaciones
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Detalles sobre cargador, accesorios o procedencia..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 resize-none"
              />
            </div>
          </form>

          {/* Footer del Drawer */}
          <div className="p-4 sm:p-6 border-t border-brand-300/40 bg-stone-50/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeRegisterDrawer}
              className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-200/60 text-stone-700 text-xs font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="register-computer-form"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-600/90 text-white font-semibold text-xs transition shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Guardar en Inventario</span>
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
