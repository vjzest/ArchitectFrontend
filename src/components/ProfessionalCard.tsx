// src/components/ProfessionalCard.jsx

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Star } from "lucide-react";

const ProfessionalCard = ({ professional }) => {
  // User ke role ke anusaar details dikhayein
  const displayName = professional.name || professional.businessName;
  const detail1 =
    professional.role === "seller"
      ? professional.materialType
      : professional.experience;
  const detailIcon =
    professional.role === "seller" ? (
      <Briefcase className="w-4 h-4 text-gray-500" />
    ) : (
      <Star className="w-4 h-4 text-gray-500" />
    );

  return (
    <div className="bg-white border rounded-xl shadow-soft p-4 text-center group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-gray-100 group-hover:border-primary/50 transition-all">
        <AvatarImage src={professional.photoUrl} alt={displayName} />
        <AvatarFallback className="text-xl font-bold">
          {displayName ? displayName.charAt(0).toUpperCase() : "U"}
        </AvatarFallback>
      </Avatar>
      <h3 className="font-bold text-lg text-gray-800">{displayName}</h3>
      <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mt-1">
        <MapPin className="w-4 h-4" />
        <span>{professional.city}</span>
      </div>
      {detail1 && (
        <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mt-1">
          {detailIcon}
          <span>{detail1}</span>
        </div>
      )}
      <a href={`mailto:${professional.email}`}>
        <Button className="mt-4 w-full btn-primary">Contact Now</Button>
      </a>
    </div>
  );
};

export default ProfessionalCard;
