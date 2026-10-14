import logging
import os
from html import escape

from telegram import (
    Update,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    KeyboardButton,
    ReplyKeyboardMarkup,
    ReplyKeyboardRemove,
)
from telegram.error import TelegramError
from telegram.ext import (
    Application,
    CallbackQueryHandler,
    CommandHandler,
    ContextTypes,
    MessageHandler,
    filters,
)

logging.basicConfig(
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    level=logging.INFO,
)
logging.getLogger("httpx").setLevel(logging.WARNING)

TOKEN = os.getenv("BITE_CAFE_TOKEN")
ADMIN_ID = os.getenv("BITE_CAFE_ADMIN_ID")

# Keep IDs, names, and prices in sync with script.js on the website.
MENU = {
    1: {"name": "Класичний бургер", "category": "burger", "price": 149, "emoji": "🍔"},
    2: {"name": "Подвійний смаш", "category": "burger", "price": 199, "emoji": "🍔"},
    3: {"name": "BBQ Бекон", "category": "burger", "price": 209, "emoji": "🍔"},
    4: {"name": "Кріспі чікен", "category": "burger", "price": 169, "emoji": "🍗"},
    5: {"name": "Спайсі бургер", "category": "burger", "price": 189, "emoji": "🌶️"},
    6: {"name": "Пепероні", "category": "pizza", "price": 229, "emoji": "🍕"},
    7: {"name": "Маргарита", "category": "pizza", "price": 199, "emoji": "🍕"},
    8: {"name": "Чотири сири", "category": "pizza", "price": 249, "emoji": "🧀"},
    9: {"name": "BBQ Chicken", "category": "pizza", "price": 259, "emoji": "🍕"},
    10: {"name": "Картопля фрі", "category": "snack", "price": 69, "emoji": "🍟"},
    11: {"name": "Сирні кульки", "category": "snack", "price": 99, "emoji": "🧀"},
    12: {"name": "Курячі нагетси", "category": "snack", "price": 109, "emoji": "🍗"},
    13: {"name": "Крильця BBQ", "category": "snack", "price": 149, "emoji": "🍗"},
    14: {"name": "Комбо Bite", "category": "meal", "price": 269, "emoji": "🍔"},
    15: {"name": "Рол із куркою", "category": "meal", "price": 159, "emoji": "🌯"},
    16: {"name": "Цезар-рол", "category": "meal", "price": 169, "emoji": "🌯"},
    17: {"name": "Кола", "category": "drink", "price": 45, "emoji": "🥤"},
    18: {"name": "Домашній лимонад", "category": "drink", "price": 69, "emoji": "🍋"},
    19: {"name": "Айс-лате", "category": "drink", "price": 79, "emoji": "🧋"},
    20: {"name": "Мілкшейк", "category": "drink", "price": 89, "emoji": "🥤"},
    21: {"name": "Пончик", "category": "dessert", "price": 59, "emoji": "🍩"},
    22: {"name": "Чізкейк", "category": "dessert", "price": 99, "emoji": "🍰"},
    23: {"name": "Брауні", "category": "dessert", "price": 79, "emoji": "🍫"},
    24: {"name": "Морозиво", "category": "dessert", "price": 75, "emoji": "🍦"},
}

CATEGORIES = {
    "burger": "🍔 Бургери",
    "pizza": "🍕 Піца",
    "snack": "🍟 Закуски",
    "meal": "🌯 Комбо й роли",
    "drink": "🥤 Напої",
    "dessert": "🍰 Десерти",
}


def categories_keyboard() -> InlineKeyboardMarkup:
    keys = list(CATEGORIES.items())
    rows = []
    for index in range(0, len(keys), 2):
        rows.append([
            InlineKeyboardButton(keys[index][1], callback_data=f"cat_{keys[index][0]}")
        ] + ([InlineKeyboardButton(keys[index + 1][1], callback_data=f"cat_{keys[index + 1][0]}")] if index + 1 < len(keys) else []))
    rows.append([InlineKeyboardButton("📋 Усе меню", callback_data="all_menu")])
    rows.append([InlineKeyboardButton("🛒 Мій кошик", callback_data="cart")])
    return InlineKeyboardMarkup(rows)


def products_keyboard(category: str | None = None) -> InlineKeyboardMarkup:
    items = [
        (item_id, item)
        for item_id, item in MENU.items()
        if category is None or item["category"] == category
    ]
    rows = []
    for item_id, item in items:
        label = f"{item['emoji']} {item['name']} · {item['price']} ₴"
        rows.append([InlineKeyboardButton(label, callback_data=f"add_{item_id}")])
    rows.append([InlineKeyboardButton("🛒 Кошик", callback_data="cart")])
    rows.append([InlineKeyboardButton("↩ До категорій", callback_data="home")])
    return InlineKeyboardMarkup(rows)


def cart_total(cart: dict) -> int:
    return sum(MENU[item_id]["price"] * quantity for item_id, quantity in cart.items())


def category_text(category: str | None = None) -> str:
    if category is None:
        return "🍔 <b>Меню Bite Cafe</b>\n\nОбирай категорію або переглянь усі страви. Натисни на страву, щоб додати її в кошик."
    return f"<b>{escape(CATEGORIES[category])}</b>\n\nОбери страву, щоб додати її до кошика."


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    cart = context.user_data.setdefault("cart", {})
    context.user_data.pop("step", None)

    # A checkout link from the website carries a compact cart_<id><qty>... payload.
    # Each product ID and quantity is one base-36 character; payload stays under 64 chars.
    if context.args:
        payload = context.args[0]

        if payload.startswith("cart_"):
            encoded = payload[5:]
            website_cart = {}
            valid_payload = bool(encoded) and len(encoded) % 2 == 0
            if valid_payload:
                for offset in range(0, len(encoded), 2):
                    try:
                        item_id = int(encoded[offset], 36)
                        quantity = int(encoded[offset + 1], 36)
                    except ValueError:
                        valid_payload = False
                        break
                    if item_id not in MENU or not 1 <= quantity <= 35:
                        valid_payload = False
                        break
                    website_cart[item_id] = quantity

            if valid_payload and website_cart:
                # The web cart is the source of truth for this checkout; replace old bot selections.
                cart.clear()
                cart.update(website_cart)
                context.user_data.pop("customer_name", None)
                context.user_data.pop("customer_phone", None)
                context.user_data.pop("customer_address", None)
                total = cart_total(cart)
                lines = [
                    f"{MENU[item_id]['emoji']} {escape(MENU[item_id]['name'])} × {quantity} — {MENU[item_id]['price'] * quantity} ₴"
                    for item_id, quantity in cart.items()
                ]
                markup = InlineKeyboardMarkup([
                    [InlineKeyboardButton(f"✅ Далі · {total} ₴", callback_data="checkout")],
                    [InlineKeyboardButton("🗑 Очистити кошик", callback_data="clear_cart")],
                    [InlineKeyboardButton("🍽 Додати ще страви", callback_data="home")],
                ])
                await update.effective_message.reply_text(
                    "🛒 <b>Твоє замовлення з сайту Bite Cafe</b>\n\n"
                    + "\n".join(lines)
                    + f"\n\n<b>Сума за страви: {total} ₴</b>\n\n"
                    "Натисни «Далі», щоб вказати ім’я, телефон, адресу доставки й спосіб оплати. "
                    "Вартість доставки, якщо вона є, кафе підтвердить окремо.",
                    parse_mode="HTML",
                    reply_markup=markup,
                )
                return
            await update.effective_message.reply_text(
                "Не вдалося прочитати кошик із сайту. Відкрий сайт ще раз, перевір кошик і повтори перехід у Telegram.",
                reply_markup=categories_keyboard(),
            )
            return

        if payload.startswith("product_"):
            try:
                item_id = int(payload.removeprefix("product_"))
            except ValueError:
                item_id = -1
            if item_id in MENU:
                cart[item_id] = cart.get(item_id, 0) + 1
                item = MENU[item_id]
                await update.effective_message.reply_text(
                    f"✅ Додав у кошик: {item['emoji']} <b>{escape(item['name'])}</b> — {item['price']} ₴\n\n" + category_text(),
                    parse_mode="HTML",
                    reply_markup=categories_keyboard(),
                )
                return

    await update.effective_message.reply_text(
        "👋 <b>Вітаємо в Bite Cafe!</b>\n\nСмачна їжа вже близько. Обирай страви нижче або додай їх на сайті, а замовлення оформи тут, у Telegram.",
        parse_mode="HTML",
        reply_markup=categories_keyboard(),
    )

async def show_cart(update: Update, context: ContextTypes.DEFAULT_TYPE, *, new_message: bool = True) -> None:
    cart = context.user_data.setdefault("cart", {})
    if not cart:
        text = "🛒 <b>Кошик поки порожній</b>\n\nОбери щось смачне в меню."
        markup = categories_keyboard()
    else:
        lines = [
            f"{MENU[item_id]['emoji']} {escape(MENU[item_id]['name'])} × {quantity} — {MENU[item_id]['price'] * quantity} ₴"
            for item_id, quantity in cart.items()
        ]
        text = "🛒 <b>Твій кошик</b>\n\n" + "\n".join(lines) + f"\n\n<b>Разом: {cart_total(cart)} ₴</b>"
        markup = InlineKeyboardMarkup([
            [InlineKeyboardButton("✅ Оформити замовлення", callback_data="checkout")],
            [InlineKeyboardButton("🗑 Очистити кошик", callback_data="clear_cart")],
            [InlineKeyboardButton("🍽 Продовжити вибір", callback_data="home")],
        ])

    if new_message:
        await update.effective_message.reply_text(text, parse_mode="HTML", reply_markup=markup)
    else:
        await update.callback_query.edit_message_text(text, parse_mode="HTML", reply_markup=markup)


async def callbacks(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()
    data = query.data or ""
    cart = context.user_data.setdefault("cart", {})

    if data == "home":
        await query.edit_message_text(category_text(), parse_mode="HTML", reply_markup=categories_keyboard())
    elif data == "all_menu":
        await query.edit_message_text("📋 <b>Усе меню Bite Cafe</b>\n\nОбери страву, щоб додати її в кошик.", parse_mode="HTML", reply_markup=products_keyboard())
    elif data.startswith("cat_"):
        category = data[4:]
        if category in CATEGORIES:
            await query.edit_message_text(category_text(category), parse_mode="HTML", reply_markup=products_keyboard(category))
    elif data.startswith("add_"):
        try:
            item_id = int(data[4:])
        except ValueError:
            item_id = -1
        if item_id in MENU:
            cart[item_id] = cart.get(item_id, 0) + 1
            item = MENU[item_id]
            keyboard = InlineKeyboardMarkup([
                [InlineKeyboardButton("🛒 Переглянути кошик", callback_data="cart")],
                [InlineKeyboardButton("🍽 Продовжити вибір", callback_data="home")],
            ])
            await query.message.reply_text(
                f"✅ Додано: {item['emoji']} <b>{escape(item['name'])}</b>\nУ кошику: {cart_total(cart)} ₴",
                parse_mode="HTML",
                reply_markup=keyboard,
            )
    elif data == "cart":
        await show_cart(update, context, new_message=False)
    elif data == "clear_cart":
        cart.clear()
        await query.edit_message_text("Кошик очищено. Обери щось смачне!", reply_markup=categories_keyboard())
    elif data == "checkout":
        if not cart:
            await query.edit_message_text("Кошик порожній. Спочатку обери страви.", reply_markup=categories_keyboard())
            return
        context.user_data["step"] = "name"
        await query.message.reply_text("Як тебе звати? Напиши ім'я для замовлення.")
    elif data.startswith("pay_"):
        payment = {"pay_cash": "Готівкою при отриманні", "pay_transfer": "Переказом"}.get(data)
        if not payment:
            return
        await send_order(update, context, payment)


async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    step = context.user_data.get("step")
    if not step:
        await update.message.reply_text("Щоб обрати страви, натисни /start.")
        return

    value = (update.message.text or "").strip()
    if step == "name":
        if len(value) < 2:
            await update.message.reply_text("Напиши, будь ласка, ім'я трохи повніше.")
            return
        context.user_data["customer_name"] = value[:100]
        context.user_data["step"] = "phone"
        keyboard = ReplyKeyboardMarkup(
            [[KeyboardButton("📱 Поділитися номером", request_contact=True)]],
            resize_keyboard=True,
            one_time_keyboard=True,
        )
        await update.message.reply_text(
            "Напиши номер телефону або натисни кнопку, щоб поділитися контактом.",
            reply_markup=keyboard,
        )
    elif step == "phone":
        phone = update.message.contact.phone_number if update.message.contact else value
        if len(phone) < 5:
            await update.message.reply_text("Вкажи, будь ласка, коректний номер телефону.")
            return
        context.user_data["customer_phone"] = phone[:50]
        context.user_data["step"] = "address"
        await update.message.reply_text("📍 Напиши повну адресу доставки (вулиця, будинок, квартира за потреби).", reply_markup=ReplyKeyboardRemove())
    elif step == "address":
        if len(value) < 5:
            await update.message.reply_text("Напиши адресу трохи докладніше, будь ласка.")
            return
        context.user_data["customer_address"] = value[:300]
        context.user_data["step"] = "payment"
        keyboard = InlineKeyboardMarkup([
            [InlineKeyboardButton("💵 Готівкою при отриманні", callback_data="pay_cash")],
            [InlineKeyboardButton("💳 Переказом", callback_data="pay_transfer")],
        ])
        await update.message.reply_text("Як будеш оплачувати замовлення?", reply_markup=keyboard)


async def handle_contact(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if context.user_data.get("step") == "phone" and update.message.contact:
        context.user_data["customer_phone"] = update.message.contact.phone_number[:50]
        context.user_data["step"] = "address"
        await update.message.reply_text("📍 Напиши повну адресу доставки (вулиця, будинок, квартира за потреби).", reply_markup=ReplyKeyboardRemove())
    else:
        await handle_text(update, context)


async def send_order(update: Update, context: ContextTypes.DEFAULT_TYPE, payment: str) -> None:
    cart = context.user_data.setdefault("cart", {})
    if not cart:
        await update.callback_query.message.reply_text("Кошик порожній. Натисни /start, щоб обрати страви.")
        return
    if not ADMIN_ID:
        await update.callback_query.message.reply_text(
            "⚠️ Замовлення поки не передано: власник ще не налаштував отримання замовлень. Спробуй пізніше."
        )
        logging.error("BITE_CAFE_ADMIN_ID is not set; order could not be delivered.")
        return

    user = update.effective_user
    lines = [
        f"• {MENU[item_id]['name']} × {quantity} — {MENU[item_id]['price'] * quantity} ₴"
        for item_id, quantity in cart.items()
    ]
    order_text = (
        "🆕 <b>НОВЕ ЗАМОВЛЕННЯ · BITE CAFE</b>\n\n"
        f"<b>Ім'я:</b> {escape(context.user_data.get('customer_name', '—'))}\n"
        f"<b>Телефон:</b> {escape(context.user_data.get('customer_phone', '—'))}\n"
        f"<b>Telegram:</b> @{escape(user.username or 'не вказано')} (ID {user.id})\n"
        f"<b>Адреса:</b> {escape(context.user_data.get('customer_address', '—'))}\n"
        f"<b>Оплата:</b> {escape(payment)}\n\n"
        + "\n".join(escape(line) for line in lines)
        + f"\n\n<b>РАЗОМ: {cart_total(cart)} ₴</b>"
    )

    try:
        await context.bot.send_message(chat_id=int(ADMIN_ID), text=order_text, parse_mode="HTML")
    except (ValueError, TelegramError):
        logging.exception("Could not send an order to BITE_CAFE_ADMIN_ID.")
        await update.callback_query.message.reply_text(
            "⚠️ Не вдалося передати замовлення кафе. Спробуй трохи пізніше або повідом власника."
        )
        return

    await update.callback_query.message.reply_text(
        "✅ <b>Замовлення надіслано кафе!</b>\n\nДякуємо, що обрав Bite Cafe. Очікуй підтвердження в Telegram.",
        parse_mode="HTML",
    )
    cart.clear()
    for key in ("step", "customer_name", "customer_phone", "customer_address"):
        context.user_data.pop(key, None)


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    context.user_data.pop("step", None)
    await update.message.reply_text("Оформлення зупинено. Щоб почати спочатку, натисни /start.", reply_markup=ReplyKeyboardRemove())


def main() -> None:
    if not TOKEN:
        raise RuntimeError('Не задано BITE_CAFE_TOKEN. У PowerShell введи: $env:BITE_CAFE_TOKEN="НОВИЙ_ТОКЕН"')

    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("cancel", cancel))
    app.add_handler(CallbackQueryHandler(callbacks))
    app.add_handler(MessageHandler(filters.CONTACT, handle_contact))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))
    print("Bite Cafe bot is running...")
    app.run_polling()


if __name__ == "__main__":
    main()
