"""
Mock dataset for StadiumPilot AI.

Simulates real-time crowd, transport, and emergency data
for FIFA World Cup 2026 stadium operations.
"""

# ──────────────────────────────────────────────
# CROWD DATA – Stadium zones with density metrics
# ──────────────────────────────────────────────
MOCK_CROWD_DATA = [
    {
        "zone_id": "gate_a",
        "zone_name": "Gate A – Main Entrance",
        "capacity": 5000,
        "current_count": 4750,
        "density_pct": 95.0,
        "queue_length": 320,
    },
    {
        "zone_id": "gate_b",
        "zone_name": "Gate B – South Entrance",
        "capacity": 4000,
        "current_count": 2200,
        "density_pct": 55.0,
        "queue_length": 80,
    },
    {
        "zone_id": "gate_c",
        "zone_name": "Gate C – North Entrance",
        "capacity": 4000,
        "current_count": 3600,
        "density_pct": 90.0,
        "queue_length": 250,
    },
    {
        "zone_id": "section_101",
        "zone_name": "Section 101 – Lower West",
        "capacity": 3000,
        "current_count": 2950,
        "density_pct": 98.3,
        "queue_length": 0,
    },
    {
        "zone_id": "section_201",
        "zone_name": "Section 201 – Upper East",
        "capacity": 3000,
        "current_count": 1800,
        "density_pct": 60.0,
        "queue_length": 0,
    },
    {
        "zone_id": "concourse_north",
        "zone_name": "North Concourse – Food & Beverage",
        "capacity": 2000,
        "current_count": 1850,
        "density_pct": 92.5,
        "queue_length": 145,
    },
    {
        "zone_id": "concourse_south",
        "zone_name": "South Concourse – Food & Beverage",
        "capacity": 2000,
        "current_count": 900,
        "density_pct": 45.0,
        "queue_length": 20,
    },
    {
        "zone_id": "restroom_west",
        "zone_name": "West Restrooms – Level 1",
        "capacity": 200,
        "current_count": 190,
        "density_pct": 95.0,
        "queue_length": 45,
    },
    {
        "zone_id": "restroom_east",
        "zone_name": "East Restrooms – Level 1",
        "capacity": 200,
        "current_count": 80,
        "density_pct": 40.0,
        "queue_length": 5,
    },
    {
        "zone_id": "fan_zone",
        "zone_name": "Fan Zone – Plaza East",
        "capacity": 8000,
        "current_count": 6400,
        "density_pct": 80.0,
        "queue_length": 60,
    },
    {
        "zone_id": "parking_a",
        "zone_name": "Parking Lot A",
        "capacity": 3000,
        "current_count": 2700,
        "density_pct": 90.0,
        "queue_length": 0,
    },
    {
        "zone_id": "parking_b",
        "zone_name": "Parking Lot B",
        "capacity": 3000,
        "current_count": 1200,
        "density_pct": 40.0,
        "queue_length": 0,
    },
]

# ──────────────────────────────────────────────
# TRANSPORT DATA
# ──────────────────────────────────────────────
MOCK_TRANSPORT_DATA = [
    {
        "route_id": "shuttle_1",
        "name": "Shuttle Route 1 – Downtown Hub",
        "type": "shuttle",
        "frequency_minutes": 10,
        "capacity": 50,
        "current_load": 42,
        "next_departure": "14:35",
        "stops": ["Stadium Main Gate", "Metro Station North", "Downtown Hub"],
        "carbon_footprint_kg": 1.2,
        "is_green": True,
    },
    {
        "route_id": "subway_blue",
        "name": "Blue Line – Stadium Express",
        "type": "subway",
        "frequency_minutes": 5,
        "capacity": 400,
        "current_load": 380,
        "next_departure": "14:32",
        "stops": ["Stadium Station", "Central Park", "Union Square"],
        "carbon_footprint_kg": 0.3,
        "is_green": True,
    },
    {
        "route_id": "rideshare",
        "name": "Rideshare Drop-off Zone",
        "type": "rideshare",
        "frequency_minutes": 0,
        "capacity": 200,
        "current_load": 85,
        "next_departure": "On Demand",
        "stops": ["Gate B Drop-off"],
        "carbon_footprint_kg": 3.5,
        "is_green": False,
    },
    {
        "route_id": "bike_share",
        "name": "Bike Share Station",
        "type": "bicycle",
        "frequency_minutes": 0,
        "capacity": 80,
        "current_load": 35,
        "next_departure": "Available Now",
        "stops": ["Gate A", "Plaza East"],
        "carbon_footprint_kg": 0.0,
        "is_green": True,
    },
]

# ──────────────────────────────────────────────
# EMERGENCY DATA – Sample past incidents
# ──────────────────────────────────────────────
MOCK_EMERGENCY_DATA = [
    {
        "id": 1,
        "type": "medical",
        "location": "Section 101, Row 15",
        "description": "Fan feeling faint, possible heat exhaustion",
        "status": "resolved",
        "reporter_role": "volunteer",
    },
    {
        "id": 2,
        "type": "lost_child",
        "location": "North Concourse near Gate C",
        "description": "8-year-old child separated from parents, wearing red jersey",
        "status": "resolved",
        "reporter_role": "volunteer",
    },
    {
        "id": 3,
        "type": "security",
        "location": "Gate A – Entry Queue",
        "description": "Verbal altercation between two groups of fans",
        "status": "in_progress",
        "reporter_role": "staff",
    },
]

# ──────────────────────────────────────────────
# STADIUM MAP DATA
# ──────────────────────────────────────────────
MOCK_STADIUM_MAP = {
    "name": "MetLife Stadium",
    "city": "East Rutherford, NJ",
    "capacity": 82500,
    "gates": [
        {"id": "gate_a", "name": "Gate A", "lat": 40.8135, "lng": -74.0745, "type": "main"},
        {"id": "gate_b", "name": "Gate B", "lat": 40.8128, "lng": -74.0738, "type": "standard"},
        {"id": "gate_c", "name": "Gate C", "lat": 40.8142, "lng": -74.0752, "type": "standard"},
        {"id": "gate_d", "name": "Gate D", "lat": 40.8120, "lng": -74.0760, "type": "accessible"},
    ],
    "facilities": [
        {"id": "restroom_w1", "name": "Restroom West L1", "lat": 40.8133, "lng": -74.0748, "type": "restroom"},
        {"id": "restroom_e1", "name": "Restroom East L1", "lat": 40.8130, "lng": -74.0740, "type": "restroom"},
        {"id": "food_north", "name": "Food Court North", "lat": 40.8140, "lng": -74.0745, "type": "food"},
        {"id": "food_south", "name": "Food Court South", "lat": 40.8125, "lng": -74.0745, "type": "food"},
        {"id": "firstaid_1", "name": "First Aid Station 1", "lat": 40.8135, "lng": -74.0750, "type": "medical"},
        {"id": "atm_1", "name": "ATM – Gate A Lobby", "lat": 40.8136, "lng": -74.0746, "type": "atm"},
        {"id": "refill_1", "name": "Water Refill Station", "lat": 40.8138, "lng": -74.0744, "type": "refill"},
        {"id": "merchandise", "name": "Official Merchandise Store", "lat": 40.8132, "lng": -74.0743, "type": "shop"},
    ],
}

# ──────────────────────────────────────────────
# SAMPLE CONVERSATIONS (for README / demo)
# ──────────────────────────────────────────────
SAMPLE_CONVERSATIONS = {
    "fan": [
        {
            "user": "Where is my seat? Section 102, Row 8, Seat 14",
            "assistant": "Your seat is in Section 102 (Lower Level East Side), Row 8, Seat 14. "
                         "From Gate B, walk straight ahead and take the first right past the food court. "
                         "Your section entrance is clearly marked. Estimated walk time: 3 minutes. "
                         "Would you like directions to the nearest restroom or food court on the way?",
        },
        {
            "user": "Where can I get food? I'm vegetarian.",
            "assistant": "There are several food options! The South Concourse food court (Level 1, near Gate B) "
                         "has a dedicated vegetarian section with options like falafel wraps, veggie burgers, "
                         "and fresh salads. The queue there is currently short (about 5 minutes). "
                         "The North Concourse is busier right now (~20 min wait). "
                         "For sustainability, there's also a plant-based pop-up near the Fan Zone! 🌱",
        },
        {
            "user": "أين أقرب دورة مياه؟",
            "assistant": "أقرب دورة مياه تقع في الجناح الغربي - الطابق الأول، على بُعد حوالي 50 متراً من موقعك الحالي. "
                         "هناك طابور قصير حالياً (حوالي 3 دقائق انتظار). "
                         "البديل الأقرب هو دورة مياه الجناح الشرقي وهي أقل ازدحاماً الآن.",
        },
    ],
    "volunteer": [
        {
            "user": "I found a lost child near Gate C, she's about 6 years old",
            "assistant": "Activate Lost Child Protocol immediately:\n\n"
                         "1. Stay calm and reassure the child – do NOT leave her alone\n"
                         "2. Escort her to the nearest Security Point (Gate C has one)\n"
                         "3. Radio supervisor: 'Code Purple at Gate C'\n"
                         "4. Get a description: name, parents' names, what they're wearing\n"
                         "5. DO NOT announce on PA yet – wait for supervisor authorization\n\n"
                         "I'll generate an incident report now. Can you provide the child's description?",
        },
    ],
}
