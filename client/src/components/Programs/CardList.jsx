import React from 'react';
import CardListItem from './CardListItem';
import { useContext } from 'react';
import { programContext } from '../../contexts/ProgramProvider';

function CardList(props) {

  const { setNonUserProgramsByText, setAllSearchableProgramsByText } = useContext(programContext);

  const searchProgramsByText =(searchText) => {
    if(!props.editable) {
      if(props.userView){
        setNonUserProgramsByText(searchText)
      } else {
        setAllSearchableProgramsByText(searchText)
      }
    }
    
  }

  const cards = props.cardData.map((card) => (
    <CardListItem
      key={card.id}
      programId={card.id}
      name={card.name}
      description={card.description}
      path={props.path}
      path_id={card.id}
      editable={props.editable}
      userView={props.userView}
      currentProfile={props.currentProfile}
      setCurrentProfile={props.setCurrentProfile}
    />
  ));

  return (
      <div className="min-vh-100">
        <h1 className="display-5 pt-3 fw-bold text-white">{props.title}</h1>
        {!props.editable && <div>
          <input
            className="form-control "
            type="search"
            placeholder="type a program name or description"
            onChange={(e) => searchProgramsByText(e.target.value)}
          /> 
        </div>}
        <div className="px-3 row row-cols-1 row-cols-lg-2 row-cols-xl-3">
          {cards}
        </div>
      </div>
  );
}

export default CardList;
