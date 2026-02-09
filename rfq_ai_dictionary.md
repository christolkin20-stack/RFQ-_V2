# Slovník / pravidla pro RFQ AI bota (interní data only)

## Cíl
- Uživatel se může ptát „lidsky“.
- Bot odpovídá POUZE z interních dat RFQ systému (DB + dokumenty).
- Když data chybí, bot řekne co přesně chybí (např. rfq_id/contract_id) a navrhne další krok.

## Intenty (příklady)
- rfq_status: stav RFQ
- rfq_deadline: deadline/uzávěrka RFQ
- rfq_scope: díly/množství/měna/incoterms
- quote_price: cena z nabídky dodavatele
- quote_status: stav nabídky
- contract_end: datum konce platnosti smlouvy
- contract_supplier: dodavatel na smlouvě
- delivery_terms: incoterms/dodací podmínky
- lead_time: dodací lhůta
- supplier_risk: interní risk hodnocení
- missing_context: dotaz bez kontextu → vyžádat ID

## Entitní typy (co bot typicky extrahuje)
- rfq_id (např. RFQ-123456)
- contract_id (CTR-123456)
- supplier (název dodavatele)
- part_no (PN-12345)
- dates (deadline, start/end)
- currency (EUR/USD/…)
- incoterms (EXW/FCA/…)
- lead_time_days
- payment_terms

## Styl odpovědí (lidské písmo)
- Stručně, jasně, 1–3 věty.
- Klíčová data zvýraznit (**tučně**).
- Když se odpověď opírá o dokument, připojit citaci/odkaz na odstavec (pokud máš RAG).

## Bezpečnostní pravidla (anti-hallucination)
- Nikdy nevymýšlet datum/cenu/termín.
- Pokud nejsou v datech: „V systému to nemám“ + co chybí.
- Neodpovídat mimo scope (např. veřejné kurzy, news), pokud to není součást systému.

## Dataset formát
Soubor `rfq_qa_100k.jsonl`:
- jedna JSON řádka = jeden Q/A
- pole: id, intent, question, answer, evidence, language, style
