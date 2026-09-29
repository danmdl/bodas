"use client";
import { useState } from "react";
import { ArrowUpRight, Plus, Plane } from "lucide-react";
import type { WeddingData } from "@/lib/wedding-data";
import { symbolicKilometers, tripBudget } from "@/lib/travel-reference";
// Slider bounds are editable here. Each step represents one Argentine peso.
const giftSlider = { min: 10_000, max: 1_000_000, step: 1 };
const number = (n: number) =>
  n.toLocaleString("es-AR", { maximumFractionDigits: 0 });

export default function GiftKilometers({
  data,
  onGift,
}: {
  data: WeddingData;
  onGift: () => void;
}) {
  const ref = data.travelReference;
  const [amount, setAmount] = useState(
    Math.min(giftSlider.max, Math.max(giftSlider.min, ref.suggestedGiftsArs[1] ?? ref.suggestedGiftsArs[0] ?? 100_000)),
  );
  if (!ref.enabled)
    return (
      <div className="support-invitation">
        <h3>
          Tu apoyo nos lleva <em>más lejos.</em>
        </h3>
        <button className="button button-gold" onClick={onGift}>
          Tu apoyo <ArrowUpRight size={18} />
        </button>
      </div>
    );
  const km = symbolicKilometers(
    amount,
    ref.arsPerUsd,
    ref.flightUsd,
    ref.roundTripKm,
    0.001,
  );
  const budget = tripBudget(ref);
  return (
    <div className="gift-distance-section">
      <div className="gift-distance-heading">
        <p className="eyebrow">CADA GESTO ACORTA LA DISTANCIA</p>
        <h3>
          Tu apoyo se convierte
          <br />
          en <em>camino.</em>
        </h3>
        <p>Imaginá cuánto nos acerca tu regalo al sueño de viajar juntos.</p>
      </div>
      <div className="gift-distance-body">
        <div className="kilometer-calculator">
          <div className="gift-slider">
            <label htmlFor="gift-amount">Elegí tu aporte</label>
            <output htmlFor="gift-amount">AR$ {number(amount)}</output>
            <input
              id="gift-amount"
              type="range"
              min={giftSlider.min}
              max={giftSlider.max}
              step={giftSlider.step}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              aria-valuetext={`AR$ ${number(amount)}, ${km.toLocaleString("es-AR", { maximumFractionDigits: 3 })} kilómetros simbólicos`}
              style={{
                background: `linear-gradient(to right, var(--gold) ${((amount - giftSlider.min) / (giftSlider.max - giftSlider.min)) * 100}%, #385159 ${((amount - giftSlider.min) / (giftSlider.max - giftSlider.min)) * 100}%)`,
              }}
            />
            <div className="gift-slider-limits" aria-hidden="true">
              <span>AR$ {number(giftSlider.min)}</span>
              <span>AR$ {number(giftSlider.max)}</span>
            </div>
          </div>
          <div
            className="kilometer-result"
            aria-live="polite"
            aria-atomic="true"
          >
            <span>nos acerca aproximadamente</span>
            <strong>
              {km.toLocaleString("es-AR", { maximumFractionDigits: 3 })}
              <small>km</small>
            </strong>
            <span>simbólicos a {ref.destination}</span>
          </div>
          <button
            className="alias-distance"
            onClick={onGift}
            aria-label={`Ver y copiar el alias ${data.gifts.alias}`}
          >
            <span>ALIAS PARA TU APOYO</span>
            <strong>
              {data.gifts.alias ?? "Próximamente"} <ArrowUpRight size={22} />
            </strong>
          </button>
        </div>
        <div className="travel-budget">
          <p className="eyebrow">
            <Plane size={17} /> UN SUEÑO PARA DOS
          </p>
          <h4>{ref.destination}</h4>
          <p>{ref.departureLabel}</p>
          <dl>
            <div>
              <dt>Vuelos ida y vuelta · {ref.people} personas</dt>
              <dd>US$ {number(ref.flightUsd)}</dd>
            </div>
            <div className="budget-total">
              <dt>Viaje estimado con estadía</dt>
              <dd>
                US$ {number(budget[0])} a {number(budget[1])}
              </dd>
            </div>
          </dl>
          <p className="budget-context">
            Incluye los vuelos de referencia, {ref.nights} noches, comidas y una
            previsión para traslados locales y visitas.
          </p>
          <details className="budget-method">
            <summary>
              Cómo calculamos la referencia <Plus size={15} />
            </summary>
            <div>
              <p>
                <strong>Vuelo:</strong> {ref.flightConditions}{" "}
                {ref.flightSource}, compartida el {ref.quoteDateLabel}. El
                precio puede cambiar.{" "}
                <a
                  href={ref.flightUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Volver a consultar
                </a>
                .
              </p>
              <p>
                <strong>Estadía:</strong> {ref.accommodationNote}{" "}
                <a
                  href={ref.accommodationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver hotel de referencia
                </a>
                .
              </p>
              <p>
                <strong>Supuestos para dos:</strong> {ref.days} días de comidas
                a US$ {number(ref.mealsPerDayForTwoUsd[0])}–
                {number(ref.mealsPerDayForTwoUsd[1])} por día y US${" "}
                {number(ref.localTransportAndVisitsUsd[0])}–
                {number(ref.localTransportAndVisitsUsd[1])} para traslados
                locales y visitas. Son estimaciones de planificación. No
                incluyen seguro ni impuestos o cargos personales adicionales.
              </p>
              <p>
                <strong>Kilómetros:</strong> repartimos los{" "}
                {number(ref.roundTripKm)} km aproximados de ida y vuelta en
                proporción al costo de los dos pasajes. Es una equivalencia
                simbólica, no millas de una aerolínea.{" "}
                <a
                  href={ref.distanceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Distancia de referencia
                </a>
                .
              </p>
              <p>
                <strong>Cambio utilizado:</strong> US$ 1 = AR${" "}
                {number(ref.arsPerUsd)},{" "}
                <a
                  href={ref.exchangeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  BNA vendedor
                </a>{" "}
                del {ref.exchangeDateLabel}. Referencia editable que no se
                actualiza automáticamente. No equivale al costo del dólar
                tarjeta.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
