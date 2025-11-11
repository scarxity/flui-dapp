module contracts::crowdfunding {
    use std::string::String;
    use sui::balance::{Self as balance, Balance};
    use sui::coin::{Self as coin, Coin};
    use sui::event;

    public struct Event<phantom T> has key, store {
        id: UID,
        owner: address,
        name: String,
        description: String,
        image_ref: String,
        vault_balance: Balance<T>,
        current_amount: u64,
        target_amount: u64,
        isOpen: bool,
    }

    public struct EventCreated<phantom T> has copy, drop {
        event_id: ID,
        owner: address,
        name: String,
        description: String,
        image_ref: String,
        target_amount: u64,
    }

    public struct FundsWithdrawn<phantom T> has copy, drop {
        event_id: ID,
        owner: address,
        amount: u64,
    }

    public fun create<T>(
        name: String, 
        description: String, 
        image_ref: String, 
        target_amount: u64, 
        ctx: &mut TxContext
    ) {
        let empty_balance = balance::zero<T>();
        let event = Event<T> {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            name,
            description,
            image_ref,
            vault_balance: empty_balance,
            current_amount: 0,
            target_amount,
            isOpen: true
        };
        let event_id = object::id(&event);
        transfer::share_object(event);
        event::emit<EventCreated<T>>(EventCreated<T> {
            event_id,
            owner: tx_context::sender(ctx),
            name,
            description,
            image_ref,
            target_amount,
        });
    }

    public fun donate<T>(donation: Coin<T>, event: &mut Event<T>) {
        assert!(event.isOpen, 0);

        let amount = coin::value(&donation);
        assert!(amount > 0, 1);
        
        let b = coin::into_balance(donation);
        balance::join(&mut event.vault_balance, b);

        event.current_amount = event.current_amount + amount;

        if (event.current_amount >= event.target_amount) {
            event.isOpen = false;
        };
    }

    public fun withdraw<T>(event: &mut Event<T>, ctx: &mut TxContext){
        assert!(ctx.sender() == event.owner, 0);
        assert!(!event.isOpen, 1);

        let amount = balance::value(&event.vault_balance);
        let collected_balance = balance::withdraw_all(&mut event.vault_balance);
        let collected_coin = coin::from_balance(collected_balance, ctx);
        transfer::public_transfer(collected_coin, event.owner);

        event::emit<FundsWithdrawn<T>>(FundsWithdrawn<T> {
            event_id: object::id(event),
            owner: event.owner,
            amount,
        });
    }

    public fun close<T>(event: &mut Event<T>, ctx: &mut TxContext) {
        assert!(ctx.sender() == event.owner, 0);
        assert!(event.isOpen, 2);

        event.isOpen = false;
    }
}
