# Buyer Guide -- RFQ Management System

Prakticky orientovany pruvodce pro nakupciky (buyers) pracujici s RFQ aplikaci.

---

## 1. Prihlaseni a navigace

### Prihlaseni

- Otevrete `/login/` v prohlizeci.
- Zadejte uzivatelske jmeno a heslo. Po uspesnem overeni budete presmerovani na hlavni stranku (`/`).
- Pokud pristupujete na chraneny URL bez prihlaseni, budete automaticky presmerovani na login s parametrem `?next=`, ktery vas po prihlaseni vrati zpet.

### Hlavni navigace

| Prvek | Umisteni | Funkce |
|---|---|---|
| **Sidebar -- Projekty** | levy panel | Seznam vsech projektu ve vasi Company, serazeny od naposledy upraveneho |
| **Horni lista -- Views** | horni navigace | Prepinani mezi pohledy: Items, Quoting Process (RFQ Planner), Quotes Center, Price Comparison |
| **User menu** | pravy horni roh | Informace o prihlasenem uzivateli, role, odhlaseni (`/logout/`) |

> **Tip:** Kazdy uzivatel vidi pouze projekty sve Company. Superadmin muze prepnout kontext pomoci `switch_company`.

---

## 2. Vytvareni projektu

### Novy projekt

1. Kliknete na tlacitko **+ Novy projekt** v sidebaru.
2. Vyplnte metadata:
   - **Nazev** -- povinny, max 255 znaku
   - **Popis** -- volitelny, interni poznamka
   - **Deadline** -- datum pro uzavreni poptavky
3. Projekt se ulozi s automaticky generovanym ID (UUID).

### Status lifecycle projektu

```
Created  -->  In process  -->  Done
```

| Status | Vyznam |
|---|---|
| **Created** | Novy projekt, priprava podkladu |
| **In process** | Aktivni poptavkovy cyklus -- RFQ rozeslany, sbiranje nabidek |
| **Done** | Poptavka uzavrena, dodavatel vybran |

Status menite rucne v hlavicce projektu. Zmena se okamzite propise do JSON dat projektu.

---

## 3. Sprava polozek (Items)

### Pridani polozek

**Manualne:** Kliknete na **+ Add Item** a vyplnte formular s nasledujicimi poli:

| Pole | Popis | Povinne |
|---|---|---|
| `drawing_no` | Cislo vykresu / interne oznaceni | ano |
| `description` | Textovy popis polozky | ano |
| `manufacturer` | Vyrobce | ne |
| `mpn` | Manufacturer Part Number | ne |
| `qty` | Pozadovane mnozstvi (podporuje az 10 qty tiers: `qty_1` az `qty_10`) | ano |
| `target_price` | Cilova cena | ne |
| `status` | Status polozky (viz nize) | auto |

**Bulk import z Excelu:** Pripravte XLSX soubor se sloupci odpovidajicimi polim vyse. Nahrajte pres funkci importu v Items view. System zpracuje radky a vytvori polozky v projektu.

### Statusy polozek

```
New --> TO-QUOTE --> RFQ Sent --> Quote Received --> Comparison --> Selected --> Done
```

| Status | Co to znamena |
|---|---|
| **New** | Polozka prave vytvorena, ceka na zarazeni do RFQ |
| **TO-QUOTE** | Urcena k poptani, pripravena pro RFQ Planner |
| **RFQ Sent** | RFQ bylo rozeslano dodavatelum |
| **Quote Received** | Prijata alespon jedna nabidka |
| **Comparison** | Probiha cenove porovnani dodavatelu |
| **Selected** | Dodavatel vybran |
| **Done** | Polozka uzavrena |

---

## 4. RFQ Planner

RFQ Planner najdete v tabu **Quoting Process** v horni navigaci projektu.

### Pracovni postup

1. **Vyber polozek** -- Oznacte polozky, ktere chcete poptavat (status TO-QUOTE nebo RFQ Sent).
2. **Prirazeni dodavatelu** -- Ke kazde polozce priradite jednoho nebo vice dodavatelu. Muzete pridat dodavatele hromadne pro vice polozek najednou.
3. **Generovani supplier access linku** -- System vytvori unikatni token-based URL pro kazdeho dodavatele:
   - URL format: `/portal/<token>/`
   - Token je UUID slouzi jako autentizace -- dodavatel nepotrebuje ucet
4. **Nastaveni kontaktnich udaju** -- Ke kazdemu linku pridejte:
   - `contact_name` -- jmeno kontaktni osoby na strane buyera
   - `contact_email` -- email pro dotazy dodavatele
   - `contact_phone` -- telefon (volitelne)
   - `instruction_message` -- instrukce pro dodavatele
5. **Platnost linku** -- Nastavte `valid_until` pro exspiraci. Po tomto datu portal zobrazuje chybovou hlasku.

### Bulk generovani

Pro hromadne vytvoreni linku pouzijte endpoint bulk generate -- vyberete vice dodavatelu a polozek, system vytvori vsechny kombinace najednou.

---

## 5. Sprava dodavatelu

### Supplier Access Links

Kazdy link obsahuje:
- **Token** (UUID) -- slouzi jako pristupovy klic
- **Supplier name** -- nazev dodavatele
- **Requested items** -- seznam polozek k oceneni s qty tiers
- **Status** -- aktualni stav interakce
- **Round** -- cislo kola vyjednavani (zacinajici od 1)

### Statusy dodavatelskeho pristupu

```
sent --> viewed --> submitted --> under_review --> approved / rejected / re_quote_requested / lost / expired
```

| Status | Popis |
|---|---|
| **sent** | Link vygenerovan a odeslan |
| **viewed** | Dodavatel otevriel portal (automaticky pri prvni navsteve) |
| **submitted** | Dodavatel odeslal nabidku |
| **under_review** | Nabidka je v procesu hodnoceni |
| **approved** | Nabidka schvalena buyerem |
| **rejected** | Nabidka zamitnuta (s duvodem v `rejection_reason`) |
| **re_quote_requested** | Pozadavek na novou nabidku -- dodavatel muze znovu editovat |
| **lost** | Dodavatel neni vybrany |
| **expired** | Link zrusen nebo vyprsel |

### Akce buyera

- **Approve** -- schvalit nabidku, vytvori se snapshot v `SupplierAccessRound`
- **Reject** -- zamitnout s duvodem
- **Re-quote** -- pozadat o novou nabidku, zvysi cislo kola (round)
- **Cancel** -- oznaci link jako expired

### Odeslani emailem

Zkopirujte vygenerovany portal link a poslete ho dodavateli emailem. Link nevy\zaduje registraci ani prihlaseni.

---

## 6. Sber nabidek (Quotes)

### Quotes Center

Quotes Center je centralni hub pro vsechny nabidky. Najdete ho v horni navigaci. Zobrazuje:
- **Manual quotes** -- nabidky zadane rucne v systemu
- **Portal quotes** -- nabidky prijate pres supplier portal (status submitted/approved)

### Filtrovani

- Podle projektu (`project_id`)
- Podle dodavatele (`supplier`)
- Podle platnosti (`expired=true/false`)
- Fulltextove hledani (`search`) -- prohledava quote_number, supplier_name, project_name

### Vytvoreni nabidky manualne

1. Kliknete na **+ Nova nabidka** v Quotes Center.
2. Vyplnte povinne udaje:
   - **Supplier name** -- nazev dodavatele
   - **Expire date** -- datum platnosti (nebo pouzijte preset: 30/60/90/120/360 dni)
3. Volitelne udaje:
   - `currency` (vychozi EUR), `shipping_cost`, `incoterm`, `MOV`, `payment_terms`, `packaging`
4. Pridejte radky nabidky (Quote Lines):
   - `drawing_number`, `manufacturer`, `mpn`, `description`
   - `moq` (vychozi 1), `supplier_lead_time` (vychozi 14 dni)
   - Cenove tiers: `qty_1`/`price_1` az `qty_10`/`price_10`

### Auto-generace quote number

Pokud nezadate `quote_number`, system automaticky vygeneruje format:
```
{SUPPLIER_NAME}_{YYYYMMDD_HHMM}
```

### Import z portalu

Nabidky odeslane dodavatelem pres portal se automaticky zobrazuji v Quotes Center se zdrojem `portal`. Po schvaleni (approve) se data ulozi jako snapshot v historii kol.

### Zdroje nabidek (source)

| Source | Puvod |
|---|---|
| `manual` | Rucne zadana v UI |
| `supplier_portal` | Prijata pres supplier portal |
| `rfq_planner` | Vytvorena z RFQ Planneru |
| `email` | Importovana z emailu |
| `import` | Bulk import |

---

## 7. Cenove porovnani (Price Comparison)

### Porovnani dodavatelu

V tabu **Price Comparison** vidite matici polozek a dodavatelu s cenami. System umoznuje:

- **Zobrazeni vsech nabidek** pro kazdou polozku vedle sebe
- **Porovnani cen** vcetne qty tiers (az 10 cenových hladin)
- **Zobrazeni dalsich parametru** -- MOQ, lead time, payment terms, incoterms

### Vyber hlavniho dodavatele (isMain)

- U kazde polozky oznacte jednoho dodavatele jako **hlavni** (flag `isMain`).
- Hlavni dodavatel se pouziva v exportech a summarich.
- Zmenu provadite kliknutim na oznaceni dodavatele u polozky.

### Export

System podporuje export do tri formatu:

| Format | Obsah |
|---|---|
| **XLSX** | Vicero listu: Projects, Items, ItemSuppliers, RFQs, Suppliers |
| **CSV** | Pouze Items s qty/price tiers |
| **PDF** | Shrnuti projektu a top dodavatele |

Moznosti exportu:
- `include_items` -- zahrnout polozky
- `include_item_suppliers` -- zahrnout dodavatele polozek
- `include_price_breaks` -- zahrnout cenove hladiny
- `suppliers_mode` -- `all` (vsichni dodavatele) nebo `main` (pouze hlavni)

---

## 8. Bulk operace

### Bulk Action Bar

1. **Vyber polozek** -- Oznacte checkboxy u vice polozek v Items view.
2. **Akce** -- V bulk action baru vyberete operaci:
   - **Change status** -- hromadna zmena statusu (napr. vsechny oznacene na TO-QUOTE)
   - **Export** -- export oznacenych polozek do XLSX/CSV
   - **Delete** -- smazani oznacenych polozek

### Confirmace destruktivnich akci

- Pred smazanim system zobrazi potvrzovaci dialog s poctem polozek.
- Akce delete vyzaduje roli **admin**.
- Zmeny statusu vyzaduji roli **editor** nebo vyssi.

### Bulk generovani RFQ

V RFQ Planneru muzete:
1. Oznacit vice polozek a dodavatelu.
2. Jednim klikem vygenerovat supplier access linky pro vsechny kombinace.

---

## 9. Tipy a best practices

### Denni workflow buyera

1. **Rano** -- Zkontrolujte Quotes Center pro nove nabidky (status `submitted`).
2. **Prubezne** -- Sledujte statusy supplier access linku (kolik dodavatelu jiz viewed/submitted).
3. **Hodnoceni** -- Po prijeti vsech nabidek prejdete na Price Comparison a porovnejte.
4. **Vyber** -- Oznacte hlavniho dodavatele (`isMain`), zmente status polozek na Selected.
5. **Uzavreni** -- Po dokonceni zmente status projektu na Done.

### Kontrolni checklist kvality dat

- [ ] Kazda polozka ma vyplneny `drawing_no` a `description`
- [ ] MPN je vyplneno u vsech polozek, kde je zname
- [ ] Qty tiers odpovidaji skutecnym pozadavkum (qty_1 = hlavni mnozstvi)
- [ ] Target price je nastavena pro referencni porovnani
- [ ] U kazde nabidky je uvedeno `expire_date`
- [ ] Hlavni dodavatel (`isMain`) je nastaven u polozek ve stavu Selected/Done
- [ ] Export pred uzavrenim projektu -- overeni kompletnosti dat
- [ ] Supplier access linky maji nastavenou platnost (`valid_until`)

### Dulezite roly a opravneni

| Role | Muze vytvaret/editovat | Muze mazat | Admin funkce |
|---|---|---|---|
| **Viewer** | ne | ne | ne |
| **Editor** | ano | ne | ne |
| **Admin** | ano | ano | ano |
| **SuperAdmin** | ano | ano | ano + sprava company |

### Caste chyby, kterym se vyhnout

- **Neposilat link bez `valid_until`** -- link bude platny neomezene, coz je bezpecnostni riziko.
- **Nekontrolovat duplikatni dodavatele** -- system neblokuje vytvoreni dvou linku pro stejneho dodavatele na stejnou polozku.
- **Nezapominat na approve/reject** -- dodavatel po odeslani nabidky ceka na reakci buyera.
- **Pravidelne exportovat** -- pred velkymi zmenami exportujte data jako zalohu.
