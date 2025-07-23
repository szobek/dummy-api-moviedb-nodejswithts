export class ActorInResponseDto {
  id: number;
  fullName: string;
  dateOfBirth: string;
  biography: string;
  sex: string;

  constructor(
   actor:any
    ) { 
        this.id = actor.id;
        this.fullName = actor.fullName;
        this.dateOfBirth = actor.date_of_birth;
        this.biography = actor.bio
        this.sex=actor.sex
    }
}